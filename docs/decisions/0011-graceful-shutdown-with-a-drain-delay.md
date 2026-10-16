# 0011. Graceful shutdown with a drain delay

- Status: Accepted
- Date: 2026-10-15

## Context

The API is stopped with a signal: Docker Compose and hosting platforms send `SIGTERM`, and Ctrl+C in a terminal sends `SIGINT`. By default Node exits immediately on either, so requests in progress are cut off and the database pool's connections are dropped without being closed. Compose waits `stop_grace_period` (10 seconds by default) after `SIGTERM` before sending `SIGKILL`, so there is a fixed window to finish cleanly.

A load balancer or platform that routes traffic by health check needs a moment to notice an instance is going away before it stops accepting connections. Decision 0010 deferred this shutting-down state to this decision.

In development, `tsx watch` sends `SIGTERM` to restart the API on every save, so any wait during shutdown slows the edit loop.

## Decision

Handle `SIGTERM` and `SIGINT` the same way:

1. Set a shutting-down flag. `/health` then returns `503 { "status": "shutting_down" }` without querying the database.
2. Wait a configurable drain delay, so traffic can move elsewhere. A delay of 0 skips the wait entirely, which is the setting for development.
3. Start a configurable timeout, then close the HTTP server (`server.close()` stops accepting connections and waits for requests in progress), then close the database pool, then exit with code 0.
4. Exit with code 1 if closing the server or the pool fails, or if the timeout fires first.

A second signal during shutdown is ignored. The handlers are registered with `once`, so repeating the same signal (a second Ctrl+C) has no handler and falls through to Node's default, which exits immediately.

## Alternatives considered

- **Node's default behavior:** no code, but requests in progress fail and database connections are dropped.
- **No drain delay (set the flag and close immediately):** enough for Compose, which routes nothing by health check. Behind a load balancer the `503` would rarely be seen, because new connections are refused as soon as the server closes.
- **A fixed delay:** simpler configuration, but every `tsx watch` restart would wait for it.
- **One deadline measured from the signal, covering the delay too:** matches how Compose measures its grace period, but the delay then has to be validated as shorter than the timeout. A timeout that starts after the delay keeps the two settings independent, at the cost of checking that their sum fits the grace period.
- **A second signal forces an exit:** explicit, and testable. Ignoring it keeps a stray signal from cutting a clean shutdown short, and the timeout and a repeated Ctrl+C remain as ways out.
- **A library (`@godaddy/terminus`, `http-terminator`, `stoppable`):** these handle idle keep-alive connections and health check wiring. Since Node 19, `server.close()` also closes idle connections, so the remaining logic is small enough to own.
- **Closing all connections when the timeout fires:** `process.exit` drops every socket anyway, so it adds nothing when the next step is exiting.
- **Passing the flag into an app factory (`createApp`):** avoids module state, but changes how the app and every route test are built, for one boolean.

## Consequences

- Requests in progress complete during a normal stop, and the pool closes its connections cleanly.
- The drain delay plus the timeout must fit inside the platform's grace period (10 seconds under Compose by default), or the process is killed partway through.
- The settings are read from `SHUTDOWN_DRAIN_DELAY_MS` (default `0`, so development restarts don't wait) and `SHUTDOWN_TIMEOUT_MS` (default `8000`, so a deployment can't forget it and the default still fits Compose's 10 seconds). A timeout of `0` turns it off, and then a connection that never finishes keeps the process alive until it is killed.
- The tests use a stub server, so Node's own `close()` behavior (requests in progress finishing, idle keep-alive connections closing) is assumed, not tested.
- Revisit when the API runs behind a load balancer or orchestrator (to choose the delay), and if a second signal should force an exit instead of being ignored.
