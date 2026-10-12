# Testing and CI

## Tests

`npm test` runs the API's unit tests with Vitest and supertest. They mock the repository, so no database is needed and they execute in well under a second.

- The terminal prints a coverage table after each run, and an HTML report is written to `apps/api/coverage`.
- `npm run -w apps/api test:watch` re-runs tests on save. Coverage is disabled in this mode to keep the execution quick and the output uncluttered.
- New code should be fully covered. If a file or line can't be meaningfully unit tested, exclude it deliberately and record the reason next to the exclusion, in the coverage config or in a `v8 ignore` comment.
- `config.ts` and the route are fully covered. The repository and the database pool show as uncovered because only a real Postgres can verify the SQL, and mocking `pg` would raise the number without testing anything. Integration tests against a real database are planned to close that gap.

## Before a commit

A pre-commit hook (Husky and lint-staged) runs ESLint on staged code files and Prettier on staged files. The lint rules are type-aware, and they ban `any`, including `any` that leaks in from untyped library calls.

## On every push and pull request

GitHub Actions runs, in order:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm test`

The workflow is in `.github/workflows/ci.yml`. It installs with `npm ci`, so a lockfile that disagrees with `package.json` fails the build. CI starts from a clean checkout, which catches things that only work on your machine, such as gitignored generated files.
