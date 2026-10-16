# 0012. Structured logging with pino

- Status: Accepted
- Date: 2026-10-16

## Context

The API logs with `console.log` and `console.error`: plain text with no levels, no request logs, and errors printed in whatever shape `console` gives them. Once the API runs in a container, its output goes to whatever collects container logs, and those tools work best with one JSON object per line. Development still needs output a person can read.

Two existing behaviors constrain the choice. Graceful shutdown (decision 0011) logs and then calls `process.exit` straight away, so a logger that buffers output must not lose those last lines. And a Compose healthcheck will request `/health` every few seconds, so logging every request would bury everything else.

## Decision

Use pino for application logs and pino-http for request logs:

- **One logger instance**, shared the way the database pool is. Errors are logged under pino's `err` key (`logger.error({ err }, 'message')`), which is the only key its error serializer formats, so stack traces are kept.
- **pino-http** logs each completed request with its status and response time, and gives each request an ID and a child logger at `req.log`.
- **The app always writes JSON to stdout**, through pino's default destination. That destination writes asynchronously but registers a synchronous flush on the process `exit` event, so lines logged just before `process.exit` are still written.
- **Readable output is a development concern only.** The dev script pipes the API's output through `pino-pretty`, which is a dev dependency. The application code never refers to it.
- **Successful `/health` requests are not logged.** pino-http's `customLogLevel` returns `silent` for `/health` responses below 400, and every other response, including a `503` from `/health`, is logged.

## Alternatives considered

- **Winston:** flexible formats and outputs, but heavier and slower, and request logging needs another package (`express-winston` or `morgan`).
- **`console` writing JSON by hand:** no dependency, but levels, error serialization, request IDs, redaction and request logging would all be written and maintained here.
- **pino-pretty as a pino transport:** the app would format its own output, so it needs a development-only switch in application code. Transports run in a worker thread, and pino documents that `logger.flush()` cannot guarantee pino-pretty has written its output.
- **Synchronous writes (`sync: true`):** guarantees every line is written as it is logged, but blocks on each write. The flush on `exit` already covers shutdown.
- **pino-http's `autoLogging.ignore` for `/health`:** it decides from the request before the route runs, so it would hide failing health checks as well as successful ones.
- **Logging every `/health` request:** complete, but at healthcheck frequency the noise outweighs the value of the successful entries.

## Consequences

- Logs are structured, carry a level, and can be filtered by request ID. Two runtime dependencies (`pino`, `pino-http`) and one dev dependency (`pino-pretty`) are added.
- Only a hard kill (`SIGKILL`) or a system failure can lose the last buffered lines, which is one more reason the shutdown delay and timeout must fit inside the platform's grace period.
- Successful health checks leave no trace in the logs. A failing one is logged, including during the drain delay, when `/health` returns `503 shutting_down` by design.
- Revisit when logs need to go somewhere other than stdout (a log service would use a transport), and when authentication adds headers such as `Authorization` and `Cookie`, which must be redacted from request logs.
