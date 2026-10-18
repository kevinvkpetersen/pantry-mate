# Configuration

## Server (`.env` at the repo root)

| Variable      | Required | Default     | Notes                                                                                                                        |
| ------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `DB_USER`     | Yes      |             | Database user                                                                                                                |
| `DB_PASSWORD` | Yes      |             | Database password                                                                                                            |
| `DB_NAME`     | Yes      |             | Database name                                                                                                                |
| `DB_PORT`     | Yes      |             | The database's port on your machine (1-65535). Compose publishes Postgres on it, and the API on your machine connects to it. |
| `DB_HOST`     | No       | `localhost` | Database host for the API on your machine                                                                                    |
| `API_PORT`    | No       | `3000`      | Port the API listens on (1-65535)                                                                                            |

Docker Compose passes `DB_USER`, `DB_PASSWORD` and `DB_NAME` to Postgres to create the database. The init scripts only run on an empty data volume, so changing them later needs `npm run db:reset`. The API checks every variable when it starts, and exits with an error message naming the variable if one is missing or malformed.

### In a container

Compose doesn't load `.env` into the `api` container. Each variable the API needs is listed under `environment:` in `compose.yml`, either taken from `.env` or fixed by the Compose setup:

| Variable                            | Value in the container                                        | Source                                                          |
| ----------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| `DB_HOST`                           | `db`, the database's service name                             | Fixed in `compose.yml`                                          |
| `DB_PORT`                           | `5432`, Postgres's port inside the Compose network            | Fixed in `compose.yml`                                          |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | The `.env` values                                             | `.env`                                                          |
| `API_PORT`                          | The `.env` value, or `3000`                                   | `.env`, with a default in `compose.yml`                         |
| `LOG_LEVEL`                         | The `.env` value, or `info`                                   | `.env`, with a default in `compose.yml`                         |
| `SHUTDOWN_DRAIN_DELAY_MS`           | The `.env` value, or `2000`. Always `0` in the dev container. | `.env`, with a default in `compose.yml`; `compose.override.yml` |
| `SHUTDOWN_TIMEOUT_MS`               | The `.env` value, or `6000`                                   | `.env`, with a default in `compose.yml`                         |

The optional values are left out of `.env.example`, so the API on your machine uses the defaults in `src/config` and the production-like stack uses the defaults in `compose.yml`. Setting one in `.env` changes both. When you add a variable the API reads, add it to `.env.example` and to the `api` service's `environment:` list, or the container won't see it.

The API port is published on all network interfaces, so a phone on your local network can reach it, and so can other devices on that network. The debugger port (9229) is published on `127.0.0.1` only.

### Logging

The API writes its logs as JSON, one object per line, to stdout. `npm run -w apps/api dev` pipes them through `pino-pretty` to make them readable, and `docker compose logs -f api | npx pino-pretty` does the same for the container. Successful `/health` requests aren't logged, so frequent healthchecks don't bury everything else. See [decision 0012](decisions/0012-structured-logging-with-pino.md).

| Variable    | Required | Default | Notes                                                                                           |
| ----------- | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| `LOG_LEVEL` | No       | `info`  | The least severe level written: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, or `silent` |

Set it to `debug` to see more detail while investigating a problem. The unit tests run with `silent`.

### Shutdown

When the API receives `SIGTERM` or `SIGINT`, `/health` starts returning `503` with `{"status":"shutting_down"}`. The API then waits for the drain delay, stops accepting connections, finishes the requests in progress, and closes the database pool. See [decision 0011](decisions/0011-graceful-shutdown-with-a-drain-delay.md).

| Variable                  | Required | Default | Notes                                                                                     |
| ------------------------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| `SHUTDOWN_DRAIN_DELAY_MS` | No       | `0`     | Time to keep serving after the signal, so a load balancer can stop sending traffic        |
| `SHUTDOWN_TIMEOUT_MS`     | No       | `8000`  | Time allowed to close the server and the pool after the delay, before exiting with code 1 |

Both are whole numbers of milliseconds, and `0` turns the delay or the timeout off. Keep the delay at `0` in development, because `tsx watch` restarts the API with `SIGTERM` on every save. Wherever the API runs, the delay plus the timeout must be shorter than the time the platform allows before it kills the process. Docker Compose allows 10 seconds by default (`stop_grace_period`).

## Mobile App (`apps/mobile/.env.*`)

`EXPO_PUBLIC_API_URL` is the full address of the API, for example `http://10.0.2.2:3000` for the Android emulator. Expo bundles every `EXPO_PUBLIC_*` value into the app, so never put a secret in these files. The values are baked in at bundle time, so restart Metro with `--clear` after changing one.

## Files

| File                                 | Contents                                                          | Committed |
| ------------------------------------ | ----------------------------------------------------------------- | --------- |
| `.env`                               | The server variables above. Secrets.                              | No        |
| `.env.example`                       | The same keys with the secrets blanked out                        | Yes       |
| `apps/mobile/.env.development`       | Public `EXPO_PUBLIC_*` values only                                | Yes       |
| `apps/mobile/.env.development.local` | Machine-specific overrides, such as a LAN IP for a physical phone | No        |

When you add a variable to `.env`, add it to `.env.example` too with any secrets removed.
