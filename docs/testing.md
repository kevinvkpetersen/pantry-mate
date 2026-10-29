# Testing and CI

## API tests

The API has two kinds of tests, set up as two Vitest projects in one config:

- **Unit tests** sit beside the code they test (`src/**/*.test.ts`). They mock the repository and the database, using supertest for HTTP requests, and run in well under a second. The project sets dummy `DB_*` values, so they don't need a `.env`.
- **Integration tests** live in `apps/api/test/`. They run the real repository and pool against a throwaway `postgres:18` container started with Testcontainers. The container starts once per run, is loaded with `docker/db/init/001-schema.sql` (not the seed data), and the table is emptied before each test. The files run one at a time, because they share the database. See [decision 0009](decisions/0009-testcontainers-for-integration-tests.md).

| Command                          | What it runs                                      | Needs Docker |
| -------------------------------- | ------------------------------------------------- | ------------ |
| `npm test`                       | Both projects and the mobile tests, with coverage | Yes          |
| `npm run -w apps/api test:unit`  | Unit tests only                                   | No           |
| `npm run -w apps/api test:int`   | Integration tests only                            | Yes          |
| `npm run -w apps/api test:watch` | Unit tests, re-run on save, without coverage      | No           |

The first integration run is slower while Docker pulls the Postgres image.

Both projects load `@pantry-mate/types` from its TypeScript source, through the `@pantry-mate/source` export condition set in `ssr.resolve.conditions` in `vitest.config.mts`. The tests don't need the package built.

- `npm test` measures both projects together and prints one coverage table. An HTML report is written to `apps/api/coverage`.
- New code should be fully covered. If a file or line can't be meaningfully tested, exclude it deliberately and record the reason next to the exclusion, in the coverage config or in a `v8 ignore` comment. `index.ts` files are excluded, because they only wire things together, so keep logic out of them.
- Code that only a real Postgres can verify, such as SQL and the `::float8` and date conversions, is covered by integration tests rather than by mocking `pg`.

## Mobile tests

The mobile app uses Jest with the `jest-expo` preset and React Native Testing Library (see [decision 0008](decisions/0008-vitest-for-the-api-jest-for-mobile.md)). The config is the `jest` block in `apps/mobile/package.json`.

- **Unit tests** sit beside the code they test (`*.test.ts` or `*.test.tsx`). Files in `src/app/` are routes, so tests for screens live in `src/__tests__/app/` instead.
- **Shared helpers** live in `src/__tests__/`: `fixtures.ts` for test data, `utils.ts` for shared assertions, and `setup.ts`, which runs before every test file. Jest only runs files ending in `.test.*`, so helpers there aren't treated as tests, and they're left out of coverage.
- **API calls are mocked.** Tests mock `@/api/items` with `jest.mock`, and `fetch` with `jest.spyOn(globalThis, 'fetch')`. `resetMocks` is on, so each test, or a `beforeEach`, sets the values its mocks return.
- **Jest's globals** (`describe`, `it`, `expect`, `jest`) are used without imports. `@types/jest` types them, through `"types": ["jest"]` in the tsconfig.
- **`render` is async** in React Native Testing Library 14, so `await render(...)`. Older examples online don't.
- `setup.ts` sets `EXPO_PUBLIC_API_URL` to `http://api.invalid`, so the tests don't need a `.env` and can't reach a real server.

| Command                             | What it runs                                   | Needs Docker |
| ----------------------------------- | ---------------------------------------------- | ------------ |
| `npm run -w apps/mobile test`       | Mobile tests, with coverage                    | No           |
| `npm run -w apps/mobile test:watch` | Mobile tests, re-run on save, without coverage | No           |

Watch mode skips coverage, because it only runs the tests related to changed files, and its table would only list the files those tests load. Watch mode also reads the Jest config when it starts, so restart it after changing the config.

The tests load `@pantry-mate/types` from its TypeScript source, through `testEnvironmentOptions.customExportConditions`. That list replaces React Native's defaults, so it repeats `require` and `react-native` before `@pantry-mate/source`.

Coverage includes all of `src` except `_layout.tsx` files, which only configure navigators. An HTML report is written to `apps/mobile/coverage`.

- New code should be fully covered, as in the API, and that includes UI code: components, screens and API calls. If a file or line can't be meaningfully tested, exclude it deliberately and record the reason next to the exclusion, in the coverage config or in an `istanbul ignore` comment. `_layout.tsx` files are excluded, so keep logic out of them.

### Coverage providers

Each app uses the default coverage provider for its test runner: v8 for the API (Vitest) and babel, which is Istanbul, for mobile (Jest). Exclusion comments differ to match: `/* v8 ignore */` in the API and `/* istanbul ignore */` in mobile.

They were compared by skipping a test file and checking which untested code each provider reported:

- **Mobile:** v8 was less accurate. With `InventoryList.test.tsx` skipped, it marked the never-run error `return` and `.catch` callback as covered, and reported 97.7% of lines where babel reported 86.7%. jest-expo compiles every file with Babel, and v8 has to map its results back through source maps, which goes wrong around JSX. v8 was also slower, about 1.6 to 2.7 seconds against 1.4.
- **API:** both found the same untested code. Istanbul additionally counts default parameter values (`emitter = process`) as branches, and doesn't read `v8 ignore` comments. Vitest compiles the TypeScript itself, and v8 maps it accurately, so Istanbul would add a dependency without catching more.

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
