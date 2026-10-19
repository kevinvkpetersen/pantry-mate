# Getting started

A step-by-step setup, from a fresh clone to the app running in an emulator.

## Prerequisites

- **Node.js**, using the version in `.nvmrc` (`nvm use`)
- **Docker** (Docker Desktop or Docker Engine), with Compose v2
- **Android Studio** with an x86_64 emulator image, to run the app. See [android-emulator.md](android-emulator.md).

## Steps

1. **Install dependencies** from the repo root. This also installs the git hooks.

    ```bash
    npm install
    ```

2. **Create the server config.** Copy the template (`.env.example`) and fill in the values, including a database password. See [configuration.md](configuration.md) for an explanation of each variable.

    ```bash
    cp .env.example .env
    ```

3. **Start the database and the API.** Both run in Docker. The first run builds the API image, which takes a minute.

    ```bash
    npm start
    ```

    On the first run, Postgres executes the scripts in `docker/db/init/` in alphabetical order. They only run when the data volume is empty, so after changing them, run `npm run db:reset`.

4. **Check the API.** It restarts by itself when you save a file in `apps/api/src` or `packages/`. Check that it works with `curl http://localhost:3000/health` (adjust the port if you changed `API_PORT`). It returns `{"status":"ok"}` when the API can reach the database. A `503` with `{"status":"unavailable"}` means the API is running but can't reach Postgres, so check that the database from step 3 is up and that `.env` matches it. To see the seed data, try `curl http://localhost:3000/items`. `docker compose ps` also shows both containers' health.

5. **Check the app config.** `apps/mobile/.env.development` should contain the API address as the Android emulator sees it. The emulator reaches your computer at `10.0.2.2`, not `localhost`. If the file is missing, create it:

    ```bash
    echo "EXPO_PUBLIC_API_URL=http://10.0.2.2:3000" > apps/mobile/.env.development
    ```

    Change the port if you changed `API_PORT`. Only put public values in this file, because anything prefixed `EXPO_PUBLIC_` is bundled into the app.

6. **Run the app.** Start the emulator first (see [android-emulator.md](android-emulator.md)), then:

    ```bash
    npm run -w apps/mobile start -- --clear
    ```

    Press `a` to open it in the emulator. Use `--clear` whenever you change an env file, because the values are baked into the bundle.

## Working on the API

- **Logs:** `npm run logs` follows the API's logs in a readable format.
- **Debugging:** run the "Attach to API" configuration from VS Code's Run and Debug view. It connects to the API in the container on port 9229 and reconnects after each restart, so breakpoints in `apps/api/src` work as usual.
- **Dependencies:** after changing dependencies or `package.json`, run `npm start` again to rebuild the image. Only the source folders are mounted into the container.
- **Running the API on your machine instead:** stop the container with `docker compose stop api`, then run `npm run -w apps/api dev`. Both use `API_PORT`, so they can't run at the same time.

See [decision 0013](decisions/0013-api-in-a-container-during-development.md) for how this is set up.

## Next

- [scripts.md](scripts.md) lists the other commands.
- [troubleshooting.md](troubleshooting.md) covers the problems you're most likely to hit.
