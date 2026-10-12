# Troubleshooting

Problems that came up while building this project, with their causes and fixes.

## The app

**The app says "Network request failed".**
Check that the API is running and that `curl http://localhost:3000/items` works on your computer. Then check that `apps/mobile/.env.development` uses `10.0.2.2` and the right port (see [android-emulator.md](android-emulator.md)), and that Metro was restarted with `--clear`, because env values are baked into the bundle.

**The API URL shows as `undefined/items`.**
The variable wasn't picked up. It must be named `EXPO_PUBLIC_API_URL`, the file must be in `apps/mobile`, and Metro needs a restart with `--clear`.

**React Native DevTools fails to launch on Linux.**
The debugger is a separate Electron app and doesn't affect the build. Console output still appears in the Expo terminal, and the dev menu (`m`) works without it. Two errors have been seen: a sandbox permissions error (the helper binary must be owned by root with mode 4755), and a launch failure caused by spaces in the cache path. Neither blocks development.

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

**VS Code shows lint or type errors that the terminal doesn't.**
The ESLint and TypeScript servers cache `node_modules` and go stale after installs or config changes. Restart both from the Command Palette: "ESLint: Restart ESLint Server" and "TypeScript: Restart TS Server". If `npm run lint` and `npm run typecheck` are clean, trust them.

**`npm audit` reports dozens of vulnerabilities.**
They are advisories in Expo's build tooling (the bundler and config plugins), and they have no upstream fix yet. `npm audit fix --force` proposes downgrading Expo to a very old version, so don't run it. `npm audit --omit=dev -w apps/api` covers the server only, and it is clean.

**CI fails on `no-unsafe-assignment` for `process.env.EXPO_PUBLIC_*` in the mobile app.**
Expo generates `expo-env.d.ts`, which gives those variables a type, but the file is gitignored and so missing from a fresh checkout. `apps/mobile/env.d.ts` is a committed copy of the type reference that fixes this.
