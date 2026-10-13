# 0009. Testcontainers for integration tests

- Status: Accepted
- Date: 2026-10-13

## Context

The repository's SQL can only be verified against a real Postgres. A mocked `pg` can't show that the `::float8` cast returns a number and not the string `"1.5"`, that dates come back as `YYYY-MM-DD` strings, or what order rows are returned in. Those are the parts of the data layer most likely to produce errors, and the route tests, which mock the repository, never touch them.

The tests need a real database that is isolated from development data, starts the same way on every machine and in CI, and doesn't make the dev stack more complicated.

## Decision

Use Testcontainers (`@testcontainers/postgresql`) to start a throwaway `postgres:18` container for the test run:

- **One container per run.** Vitest's `globalSetup` starts it once, loads `docker/db/init/001-schema.sql` (the same file the dev database uses, so there is one source of truth), and stops it afterwards. The seed script is deliberately not loaded, because its dates are relative to today and tests need known values.
- **Connection details reach the workers through `provide` and `inject`.** A setup file stubs the `POSTGRES_*` variables before the test file loads, so the real `config`, `pool`, and `repository` run unmodified against the container.
- **Each test starts from an empty table.** A `beforeEach` runs `TRUNCATE items RESTART IDENTITY`, and each test inserts only the rows it needs.
- **Fixtures go in through a separate test pool with plain SQL,** not through the code under test, so a bug in the repository can't hide itself by corrupting both the data and the read.
- **Two Vitest projects in one config.** Unit tests sit beside the source (`src/**/*.test.ts`) and integration tests live in `apps/api/test/`. One coverage run measures both and produces a single report. Integration files run serially, since they share the database.

## Alternatives considered

- **A second database on the Compose Postgres:** no new dependency, but it shares a server with development data, so a wrong connection string could run a `TRUNCATE` against it. It also requires the dev stack to be running, and CI would need a Postgres service of its own.
- **A throwaway container managed by Compose (a profile and scripts):** no new dependency, but it needs a second fixed port, plus hand-written readiness checks and cleanup that has to survive a crashed run.
- **Mocking `pg`:** it would raise the coverage number without checking any SQL.
- **Rolling each test back in a transaction:** faster than truncating, but the repository would have to accept a database client, which changes production code to suit the tests.
- **Seeding once and sharing the data across tests:** tests then depend on each other's rows.

## Consequences

- The tests exercise the real SQL, including the casts and the date formatting, and the repository and pool are covered by a check that means something.
- `npm test` needs Docker running. `npm run test:unit` and `test:watch` select only the unit project and don't.
- One new dev dependency, and the first run is slower while the image is pulled. GitHub's Ubuntu runners include Docker, so CI needs no extra services.
- Serial integration files are fine while the suite is small. If it grows, the next step is one database per file or worker, cloned from a template database.
- When migrations replace the init scripts, the tests will apply the migrations in place of the schema file, which exercises the migrations as well. If a query builder is adopted, the tests don't change, because they assert on behavior and not on how the query is built.
- Revisit if the suite becomes slow, or if a feature needs the database in a state that truncating between tests can't provide.
