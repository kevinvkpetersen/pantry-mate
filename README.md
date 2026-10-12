# pantry-mate

[![CI](https://github.com/kevinvkpetersen/pantry-mate/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinvkpetersen/pantry-mate/actions/workflows/ci.yml)

An app to help manage the contents of your pantry and fridge.

> Status: early prototype. A React Native app reads pantry items from an Express API backed by Postgres.

## Stack

- **Mobile:** Expo / React Native
- **API:** Node.js, Express 5, TypeScript, `pg`
- **Database:** Postgres, run in Docker
- **Testing:** Vitest, supertest, v8 coverage
- **Tooling:** npm workspaces, ESLint (typescript-eslint, type-aware), Prettier, Husky + lint-staged
- **CI:** GitHub Actions

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
├── docs/
│   ├── decisions/      # Decision log: what was chosen, what was rejected, and why
├── compose.yml         # Docker stack config (including Postgres)
└── .env.example        # server and Docker configuration template
├── .github/workflows/  # CI
├── eslint.config.mjs   # one lint config for the whole repo
├── AGENTS.md           # conventions for AI coding tools
├── LICENSE
```

The API and mobile app run on your machine. Postgres runs in Docker.

## Prerequisites

- **Node.js**, using the version in `.nvmrc` (`nvm use`)
- **Docker** (Docker Desktop or Docker Engine), with Compose v2
- **Android Studio** with an x86_64 emulator image, to run the app. See [docs/android-emulator.md](docs/android-emulator.md).

## Quick start

Requires Node (the version in `.nvmrc`), Docker, and an Android emulator. The [getting started guide](docs/getting-started.md) has the full walkthrough.

```bash
npm install
cp .env.example .env            # then set POSTGRES_PASSWORD
npm start                       # Postgres in Docker
npm run -w apps/api dev         # API on http://localhost:3000
npm run -w apps/mobile start    # Expo dev server, press `a` for the emulator
```

## Troubleshooting

Common problems and fixes are in [docs/troubleshooting.md](docs/troubleshooting.md). The most frequent one is the app showing "Network request failed", which almost always means the API isn't running or the app is using the wrong address.

## Documentation

- [Getting started](docs/getting-started.md): prerequisites and a step-by-step setup
- [Configuration](docs/configuration.md): environment variables and env files
- [Scripts](docs/scripts.md): every command you can run from the repo root
- [Testing and CI](docs/testing.md): what runs on commit and on every push
- [Android emulator](docs/android-emulator.md): one-time emulator setup on Ubuntu
- [Troubleshooting](docs/troubleshooting.md): problems that came up, and their fixes
- [Decision log](docs/decisions): the significant choices, the alternatives rejected, and why

## AI assistance

AI assistance (Claude) was used for explanations, scaffolding, and code review. Design decisions and their reasoning are mine and are recorded in [docs/decisions](docs/decisions), and I reviewed and tested every change before committing it. `AGENTS.md` lists the conventions the AI tooling is given.

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).
