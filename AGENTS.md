# Project

- npm workspaces monorepo:
    - `apps/api` is a Node.js + Express + TypeScript backend.
    - `apps/mobile` is an Expo / React Native app.
    - `packages/types` is `@pantry-mate/types`, the types shared by both apps (e.g. `PantryItem`).
- Postgres and the API run in Docker Compose. `compose.yml` is the production-like stack (the API's `prod` image). The committed `compose.override.yml` is loaded automatically and makes it the dev stack: the API's `dev` image, `apps/api/src` and `packages` mounted from the host, `tsx watch`, and the inspector on `127.0.0.1:9229`. Schema and seed scripts live in `docker/db/init/`. The mobile app runs on the host.
- The API image is built from the repo root (`-f apps/api/Dockerfile .`). Changes to dependencies, `package.json` or `tsconfig.json` need a rebuild (`npm start` again), because only the source folders are mounted.
- This is not a Python project.
- Ignore `node_modules/`, `dist/`, and `.expo/`.

# Workflow

- Make small, focused edits, one change at a time.
- Ask before installing new dependencies. Once approved, install in `apps/mobile` with `npx expo install <package>` (never `npm add`), and use `npm install` elsewhere.
- Use the Node version in `.nvmrc` (`nvm use`). Non-interactive shells may not load nvm and fall back to an older system Node. `.npmrc` sets `engine-strict`, so installs fail outside the root `engines` range (Node 24+, npm 11+). Fix the Node version; never bypass it with `--force`.
- npm blocks dependency install scripts by default, and the project keeps it that way. Never run `npm install-scripts approve` (or `approve --all`) without asking. If a package fails because its install script was skipped, report it.
- Run `npm run typecheck` and `npm run lint` before declaring any task done.

# Commands

Run from the repo root.

```bash
npm run typecheck               # tsc --noEmit in every workspace
npm run lint                    # eslint in every workspace
npm run lint:fix                # eslint --fix in every workspace
npm run format                  # prettier --write
npm run format:check            # prettier --check
npm test                        # tests in every workspace, with coverage (needs Docker)
npm start                       # dev stack: docker compose up -d --build
npm run start:prod              # production-like stack: compose.yml only, rebuilt
npm run logs                    # follow the API container's logs through pino-pretty
npm stop                        # docker compose down
npm run db:reset                # wipe the database volume and recreate it
npm run -w apps/api dev         # API on the host in watch mode (run `docker compose stop api` first)
npm run -w apps/api build       # compile the API
npm run -w apps/mobile start    # Expo dev server (press `a` for the Android emulator)
npx expo-doctor                 # (in apps/mobile) diagnose dependency and config issues
npx expo install --fix          # (in apps/mobile) fix incompatible package versions
```

# Configuration

- Read config from environment variables. Never hardcode secrets.
- The root `.env` holds this machine's server and Docker config: the `DB_*` database settings and `API_PORT`. `src/config` reads each `DB_*` value separately and the pool takes them as separate options, so don't add a `DATABASE_URL` variable. Keep `.env.example` in sync when adding variables.
- `compose.yml` doesn't load `.env` into the `api` container. When adding a variable the API reads, also add it to the `api` service's `environment:` list.
- `apps/mobile/.env.development` holds only public `EXPO_PUBLIC_*` values, which are bundled into the app. Never put secrets there.
- The Android emulator reaches the host machine at `10.0.2.2`, not `localhost`.

# Code conventions

- TypeScript strict mode, plus `noUncheckedIndexedAccess` in every workspace: index reads (`arr[i]`, `Record<string, T>` lookups) include `undefined`. Prefer tighter types (`as const`, `satisfies`) over non-null assertions. `any` is banned, including `any` that leaks in from untyped library calls, and ESLint enforces it with type-aware rules.
- Import types from the shared package with `import type { ... } from '@pantry-mate/types'`.
- Imports are sorted by `eslint-plugin-simple-import-sort`. Run `npm run lint:fix` rather than reordering by hand.
- The API is layered: routes (HTTP only) call repositories (all SQL), which use the single `pg` Pool in `db/pool.ts`. Routes contain no SQL.
- Repositories return the shared types. Convert at the boundary: `numeric` columns are cast with `::float8`, and `date` columns are returned as `YYYY-MM-DD` strings.

# Mobile (Expo)

Expo ships breaking changes every SDK release, so don't trust your training data. Before writing code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `apps/mobile/package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt, an index of the Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need and don't answer from memory.

## Navigation and routing

- Use **Expo Router** for all navigation. Routes live in `apps/mobile/src/app/`. Every file there is a screen, and `_layout.tsx` files define navigators.
- Keep non-route code (API client, components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Rules

- If `ios/` and `android/` directories don't exist, they are generated (Continuous Native Generation). Never create or edit them by hand. Configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`). Run it as `npx eas-cli@latest <command>`. Docs: https://docs.expo.dev/eas/index.md
