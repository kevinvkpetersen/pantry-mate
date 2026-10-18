# 0013. API in a container during development

- Status: Accepted
- Date: 2026-10-18

## Context

Decision 0001 ran the API on the host for the fastest edit and debug loop, and deferred containerizing it. The API now has a multi-stage Dockerfile (`apps/api/Dockerfile`) with a `dev` stage and a production `prod` stage.

Running the API on the host means starting it by hand. When the work is on the mobile app, it's easy to forget, and the app then fails with "Network request failed". The API should be available whenever the database is, pick up code changes without a manual restart, and still be debuggable with breakpoints.

Two things were confirmed before choosing this: under Docker Desktop on Linux, edits to a bind-mounted folder reach `tsx watch` inside the container, and `tsx watch --inspect` passes the inspector flag to the API process it restarts, not only to the watcher.

## Decision

Run the API in Docker Compose next to Postgres, with two Compose files:

- **`compose.yml` is production-like.** The `api` service builds the `prod` target (compiled JavaScript, production dependencies only, `NODE_ENV=production`, the `node` user), connects to the database at `db`, and waits for the `db` service with `depends_on`.
- **`compose.override.yml` is the development setup.** It is committed, and Compose loads it automatically. It builds the `dev` target instead (all dependencies, `tsx watch` with the inspector on port 9229), mounts `apps/api/src` and `packages` from the host, sets `SHUTDOWN_DRAIN_DELAY_MS` to 0 because `tsx watch` restarts the API on every save, and publishes the inspector on `127.0.0.1` only.
- **`npm start` builds and brings up the development stack.** It passes `--build`, so a dependency change can't leave an old image running, and Docker's cache makes the build a no-op otherwise. `npm run start:prod` runs `compose.yml` alone, also rebuilding.
- **Debugging is by attaching.** The "Attach to API" configuration in `.vscode/launch.json` connects to port 9229, maps `/pantry-mate` in the container to the workspace, and reconnects after each restart.

Running the API on the host (`npm run -w apps/api dev`) still works after stopping the container. The Postgres setup from decision 0001 is unchanged.

## Alternatives considered

- **Keep the API on the host (decision 0001):** the shortest loop and no image to rebuild, but it has to be started by hand, and development never exercises the container.
- **Mount the whole repository, with an anonymous volume over `node_modules`:** a common pattern, but the configuration is harder to read, and the host's `apps/api/node_modules` would hide the container's. The host's packages are built for Ubuntu and the image runs Alpine, which breaks anything compiled to native code. Mounting only source folders avoids both.
- **A separate `compose.dev.yml`:** explicit, but every command needs `-f` flags or a `COMPOSE_FILE` setting.
- **A Compose profile to make the API opt-in:** keeps `npm start` to the database only, which is the opposite of the goal.
- **A devcontainer for debugging:** attaching from VS Code on the host needs only the published inspector port. A devcontainer is still possible for running the editor inside a container, and is deferred.

## Consequences

- The API runs whenever the stack does, and saving a file restarts it inside the container.
- Changing dependencies or `package.json` needs a rebuild, because those come from the image, not the mount. Running `npm start` again does it.
- Logs are JSON. `npm run logs` pipes them through `pino-pretty` on the host, since the pipe can't run inside the container without breaking signal handling.
- The API port is published on all interfaces, so a physical phone on the local network can reach it, and so can anything else on that network. The inspector, which allows running arbitrary code, stays on `127.0.0.1`.
- The API on the host and in the container can't run at the same time, because both use `API_PORT`.
- Any plain `docker compose` command loads the override. Anything that needs the production-like stack, such as CI, must pass `-f compose.yml`.
- The `api` container doesn't load `.env` as a whole. `compose.yml` lists each variable: secrets and the API port come from `.env`, the database host and port are fixed by the Compose network, and the optional settings fall back to production-like defaults. A new variable the API reads has to be added there as well as to `.env.example`.
- Revisit if file watching through the mount becomes unreliable, or if the rebuild after dependency changes slows work down enough to prefer the host again.
