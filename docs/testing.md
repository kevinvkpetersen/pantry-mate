# Testing and CI

## Tests

The API has two kinds of tests, set up as two Vitest projects in one config:

- **Unit tests** sit beside the code they test (`src/**/*.test.ts`). They mock the repository and the database, using supertest for HTTP requests, and run in well under a second. The project sets dummy `DB_*` values, so they don't need a `.env`.
- **Integration tests** live in `apps/api/test/`. They run the real repository and pool against a throwaway `postgres:18` container started with Testcontainers. The container starts once per run, is loaded with `docker/db/init/001-schema.sql` (not the seed data), and the table is emptied before each test. The files run one at a time, because they share the database. See [decision 0009](decisions/0009-testcontainers-for-integration-tests.md).

| Command                          | What it runs                                 | Needs Docker |
| -------------------------------- | -------------------------------------------- | ------------ |
| `npm test`                       | Both projects, with coverage                 | Yes          |
| `npm run -w apps/api test:unit`  | Unit tests only                              | No           |
| `npm run -w apps/api test:int`   | Integration tests only                       | Yes          |
| `npm run -w apps/api test:watch` | Unit tests, re-run on save, without coverage | No           |

The first integration run is slower while Docker pulls the Postgres image.

Both projects load `@pantry-mate/types` from its TypeScript source, through the `@pantry-mate/source` export condition set in `ssr.resolve.conditions` in `vitest.config.mts`. The tests don't need the package built.

- `npm test` measures both projects together and prints one coverage table. An HTML report is written to `apps/api/coverage`.
- New code should be fully covered. If a file or line can't be meaningfully tested, exclude it deliberately and record the reason next to the exclusion, in the coverage config or in a `v8 ignore` comment. `index.ts` files are excluded, because they only wire things together, so keep logic out of them.
- Code that only a real Postgres can verify, such as SQL and the `::float8` and date conversions, is covered by integration tests rather than by mocking `pg`.

## Before a commit

A pre-commit hook (Husky and lint-staged) runs ESLint on staged code files, Prettier on staged files, and `docker build --check` on staged Dockerfiles. The lint rules are type-aware, and they ban `any`, including `any` that leaks in from untyped library calls.

## On every push and pull request

GitHub Actions runs two jobs in parallel. The `check` job runs, in order:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm test`

The `docker` job lints the API's Dockerfile (`docker build --check`, which fails on any warning, as the pre-commit hook does) then builds the `prod` image and starts it, failing if the API doesn't log "Listening" within 15 seconds. The start check catches what a build can't, such as a package the compiled code can't load.

The workflow is in `.github/workflows/ci.yml`. The `check` job installs with `npm ci`, so a lockfile that disagrees with `package.json` fails the build. CI starts from a clean checkout, which catches things that only work on your machine, such as gitignored generated files.
