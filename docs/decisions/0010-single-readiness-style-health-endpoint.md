# 0010. Single readiness-style health endpoint

- Status: Accepted
- Date: 2026-10-13

## Context

The API needs a way to report whether it can serve requests. The first consumer is Docker Compose, once the API runs in a container: a healthcheck can use it, and other services can wait for the API with `depends_on` and `condition: service_healthy`. Later consumers could be an uptime monitor or a hosting platform, which usually ask for one health check path.

Orchestrators such as Kubernetes distinguish liveness (should the process be restarted?) from readiness (should it receive traffic?). Nothing in this stack restarts a container because a probe failed.

## Decision

Expose one endpoint, `GET /health`, with readiness semantics:

- `200 { "status": "ok" }` when the database answers a trivial query.
- `503 { "status": "unavailable" }` when it doesn't.
- The body contains only a status string. Errors are never returned, because the endpoint is unauthenticated.

Under the hood, it runs `SELECT 1` to determine the DB's status.

## Alternatives considered

- **Separate `/livez` and `/readyz` endpoints:** the Kubernetes convention. A liveness endpoint that always returns `200` only proves the event loop is running, and no consumer here would act on it, so it would be a route nobody reads.
- **A shallow check only (the process is up):** it would report healthy while the database is down, and Compose couldn't use it to gate dependent services.
- **A richer response body (a structured health format with per-dependency details):** the IETF proposal for it never became a standard, and detail in an unauthenticated response leaks information.
- **A "starting" state:** Express only answers after it starts listening, so before that the connection is refused, which Docker treats as a failing check during its start period. Listening early to report "not ready" is more machinery than a service that boots in under a second needs.

## Consequences

- The route's 200 and 503 responses are unit tested with the check mocked. The check itself is integration tested against the Testcontainers database for the healthy case, and against a pool aimed at a port with nothing listening for the failure case.
- A shutting-down state, where the endpoint returns `503` once a termination signal arrives so traffic drains first, is planned together with graceful shutdown and is not part of this decision.
- Revisit if the API moves to an orchestrator or platform that restarts processes on a failing liveness probe. Then `/livez` becomes the trivial always-`200` route and `/health` stays as the readiness check.
