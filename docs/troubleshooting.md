# Troubleshooting

Problems that came up while building this project, with their causes and fixes.

## The app

**The app says "Network request failed".**
Check that the API is running and that `curl http://localhost:3000/items` works on your computer. Then check that `apps/mobile/.env.development` uses `10.0.2.2` and the right port (see [android-emulator.md](android-emulator.md)), and that Metro was restarted with `--clear`, because env values are baked into the bundle.

**The API URL shows as `undefined/items`.**
The variable wasn't picked up. It must be named `EXPO_PUBLIC_API_URL`, the file must be in `apps/mobile`, and Metro needs a restart with `--clear`.

**React Native DevTools fails to launch on Linux.**
The debugger is a separate Electron app and doesn't affect the build. Console output still appears in the Expo terminal, and the dev menu (`m`) works without it. Two errors have been seen: a sandbox permissions error (the helper binary must be owned by root with mode 4755), and a launch failure caused by spaces in the cache path. Neither blocks development.

## The API container

**`npm start` fails with "dependency failed to start".**
The `api` service waits until the `db` service's healthcheck passes. Run `docker compose ps` to see the database's health, and `docker compose logs db` to see why it isn't healthy. The database problems below, such as an old data volume, show up here first.

**`docker compose ps` shows the API as unhealthy.**
The healthcheck calls `/health` inside the container, so unhealthy means that request failed or returned an error status. `docker compose logs api` shows why: a "Database health check failed" line means the API can't reach Postgres, and no "Listening" line means it never started. It is also unhealthy for a moment during a shutdown, while `/health` returns `503 shutting_down` on purpose.

**"Cannot find module" after adding a dependency.**
The container's `node_modules` comes from the image, not from your machine. Run `npm start` again, which rebuilds the image. The same applies after changing `package.json`.

**Code changes don't restart the API.**
Only `apps/api/src` and `packages/` are mounted into the container. Changes elsewhere need a rebuild. If changes in those folders aren't picked up either, check that the repo is on your main disk (see the Docker Desktop note under "The database").

**Breakpoints show as unbound.**
The attach configuration maps `/pantry-mate` in the container to the workspace. `localRoot` must be `${workspaceFolder}`, because VS Code doesn't resolve `.` relative to the workspace. Running `.scripts` in the Debug Console lists each loaded script and the local file it maps to.

**Port 3000 is already in use.**
The API is probably running both in the container and on your machine. Stop one: `docker compose stop api`, or stop `npm run -w apps/api dev`.

## The database

**No tables in the database.**
The init scripts in `docker/db/init/` only run when the data volume is empty. Run `npm run db:reset` to wipe the volume and re-run them.

**Init scripts are ignored under Docker Desktop.**
Docker Desktop only sees folders it shares with its VM, and a repo reached through a symlink to another drive may look empty to it. Keep the repo on your main disk. To check, run `docker compose exec db ls /docker-entrypoint-initdb.d`. It should list the SQL files.

**Postgres refuses to start with an old data volume.**
Postgres 18 images store data at `/var/lib/postgresql`, not `/var/lib/postgresql/data`, so the volume must be mounted at the new path, and an old volume has to be recreated (`npm run db:reset`, which deletes its data).

**The API exits on startup with a configuration error.**
The API checks its environment variables when it starts and names the one that's missing or malformed. Compare `.env` with `.env.example`, and see the table in [configuration.md](configuration.md).

## Tooling

**npm lists packages whose install scripts were skipped.**
npm doesn't run dependencies' install scripts unless they're approved (see [decision 0014](decisions/0014-dependency-install-scripts-blocked-by-default.md)). That's expected, and the listed packages work without them. If a package fails at runtime because its script didn't run, check what the script does, then approve that package with `npm install-scripts approve <package>`.

**VS Code shows lint or type errors that the terminal doesn't.**
The ESLint and TypeScript servers cache `node_modules` and go stale after installs or config changes. Restart both from the Command Palette: "ESLint: Restart ESLint Server" and "TypeScript: Restart TS Server". If `npm run lint` and `npm run typecheck` are clean, trust them.

**`npm audit` reports dozens of vulnerabilities.**
They are advisories in Expo's build tooling (the bundler and config plugins), and they have no upstream fix yet. `npm audit fix --force` proposes downgrading Expo to a very old version, so don't run it. `npm audit --omit=dev -w apps/api` covers the server only, and it is clean.

**CI fails on `no-unsafe-assignment` for `process.env.EXPO_PUBLIC_*` in the mobile app.**
Expo generates `expo-env.d.ts`, which gives those variables a type, but the file is gitignored and so missing from a fresh checkout. `apps/mobile/env.d.ts` is a committed copy of the type reference that fixes this.
