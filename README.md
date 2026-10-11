# pantry-mate

An app to help manage the contents of your pantry and fridge.

> Status: early prototype. A React Native app reads pantry items from an Express API backed by Postgres.

## Stack

- **Mobile:** Expo / React Native, with Expo Router
- **API:** Node.js, Express 5, TypeScript, `pg`
- **Database:** Postgres, run in Docker
- **Tooling:** npm workspaces, ESLint (typescript-eslint, type-aware), Prettier, Husky + lint-staged

## Repository layout

```
pantry-mate/
├── apps/
│   ├── api/            # Express API (@pantry-mate/api)
│   └── mobile/         # Expo app (@pantry-mate/mobile)
├── packages/
│   └── types/          # Types shared by the API and the app (@pantry-mate/types)
├── docker/
│   └── db/init/        # SQL run when the database is first created (schema, seed data)
├── compose.yml         # Postgres
├── eslint.config.mjs   # one lint config for the whole repo
└── .env.example        # server and Docker configuration template
```

The API and the mobile app run on your machine. Only Postgres runs in Docker.

## Prerequisites

- **Node.js**, using the version in `.nvmrc` (`nvm use`)
- **Docker** (Docker Desktop or Docker Engine), with Compose v2
- **Android Studio** with an x86_64 emulator image, for running the app (see "Android emulator" below)

## Getting started

1. **Install dependencies** from the repo root. This also installs the git hooks.

    ```bash
    npm install
    ```

2. **Create the server config.** Copy the template and fill in the values, including a database password.

    ```bash
    cp .env.example .env
    ```

3. **Start the database.**

    ```bash
    npm start
    ```

    On the first run, Postgres executes the scripts in `docker/db/init/` in alphabetical order. They only run when the data volume is empty, so after changing them, run `npm run db:reset`.

4. **Run the API.**

    ```bash
    npm run -w apps/api dev
    ```

    Check that it works with `curl http://localhost:3000/items` (adjust the port if you changed `API_PORT`).

5. **Create the app config.** The Android emulator reaches your computer at `10.0.2.2`, not `localhost`.

    ```bash
    echo "EXPO_PUBLIC_API_URL=http://10.0.2.2:3000" > apps/mobile/.env.development
    ```

    Only put public values in this file. Anything prefixed `EXPO_PUBLIC_` is bundled into the app.

6. **Run the app.** Start the emulator first, then:

    ```bash
    npm run -w apps/mobile start -- --clear
    ```

    Press `a` to open it in the emulator. Use `--clear` whenever you change an env file, because the values are baked into the bundle.

## Scripts

Run these from the repo root.

| Command                        | What it does                                                      |
| ------------------------------ | ----------------------------------------------------------------- |
| `npm start`                    | Start the Docker services (`docker compose up -d`)                |
| `npm stop`                     | Stop them (`docker compose down`)                                 |
| `npm run db:reset`             | Delete the database volume and recreate it from `docker/db/init/` |
| `npm run typecheck`            | `tsc --noEmit` in every workspace                                 |
| `npm run lint`                 | ESLint in every workspace                                         |
| `npm run lint:fix`             | ESLint with autofix in every workspace                            |
| `npm run format`               | Format the repo with Prettier                                     |
| `npm run format:check`         | Check formatting without changing files                           |
| `npm run -w apps/api dev`      | API in watch mode                                                 |
| `npm run -w apps/api build`    | Compile the API to `apps/api/dist`                                |
| `npm run -w apps/mobile start` | Expo dev server                                                   |

A pre-commit hook runs ESLint on staged code files and Prettier on staged files.

## Configuration

| File                                 | Contents                                                          | Committed |
| ------------------------------------ | ----------------------------------------------------------------- | --------- |
| `.env`                               | Database credentials, `DATABASE_URL`, API port. Secrets.          | No        |
| `.env.example`                       | The same keys with the secrets blanked out                        | Yes       |
| `apps/mobile/.env.development`       | Public `EXPO_PUBLIC_*` values only                                | Yes       |
| `apps/mobile/.env.development.local` | Machine-specific overrides, such as a LAN IP for a physical phone | No        |

When you add a variable to `.env`, add it to `.env.example` too.

## Android emulator (Ubuntu)

1. Check hardware acceleration with `kvm-ok` (from `cpu-checker`), and add yourself to the `kvm` group.
2. Install Android Studio and create a virtual device from an x86_64 image with Google APIs.
3. Add the SDK to your shell profile:

    ```bash
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
    ```

4. Start the emulator, then press `a` in the Expo terminal.

## Troubleshooting

- **The app says "Network request failed".** Check that the API is running and `curl` works on the host, that `apps/mobile/.env.development` uses `10.0.2.2` and the right port, and that Metro was restarted with `--clear`.
- **No tables in the database.** The init scripts only run on an empty volume. Run `npm run db:reset`.
- **Init scripts are ignored under Docker Desktop.** Docker Desktop only sees folders it shares with its VM, so keep the repo on your main disk, not on a mounted external drive.
- **Postgres refuses to start with an old data volume.** Postgres 18 images store data at `/var/lib/postgresql`, not `/var/lib/postgresql/data`, so the volume must be mounted there and old volumes recreated.
- **React Native DevTools fails to launch on Linux.** The debugger is a separate Electron app and doesn't affect the build. Console output still appears in the Expo terminal.
- **Dependency audit warnings.** `npm audit` reports advisories in Expo's build tooling. They have no upstream fix yet, and `npm audit fix --force` proposes downgrading Expo, so don't run it. `npm audit --omit=dev -w apps/api` covers the server only.
