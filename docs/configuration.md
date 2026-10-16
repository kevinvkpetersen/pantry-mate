# Configuration

## Server (`.env` at the repo root)

| Variable            | Required | Default     | Notes                                                          |
| ------------------- | -------- | ----------- | -------------------------------------------------------------- |
| `POSTGRES_USER`     | Yes      |             | Database user                                                  |
| `POSTGRES_PASSWORD` | Yes      |             | Database password. Special characters are URL-encoded.         |
| `POSTGRES_DB`       | Yes      |             | Database name                                                  |
| `POSTGRES_PORT`     | Yes      |             | Port the database is published on (1-65535)                    |
| `POSTGRES_HOST`     | No       | `localhost` | Database host. A container would use the Compose service name. |
| `API_PORT`          | No       | `3000`      | Port the API listens on (1-65535)                              |

Docker Compose reads the same `POSTGRES_*` values to create the database. The API checks every variable when it starts, and exits with an error message naming the variable if one is missing or malformed.

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
