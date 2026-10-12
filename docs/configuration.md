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
