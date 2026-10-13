# 0002. Layered API with plain `pg`

- Status: Accepted
- Date: 2026-10-09

## Context

The API starts as a thin layer between the app and Postgres, but will grow logic that belongs on the server: validation, rules about expiry, authentication, and background jobs. The data access code needs a structure that can absorb that without a rewrite, and the SQL needs to stay easy to see and test.

## Decision

Layer the API as route, then repository, then a single `pg` Pool:

- **Routes** handle HTTP only: reading and validating the request, choosing a status code, and sending the response. They contain no SQL.
- **Repositories** hold all of the SQL and return the shared types. Database quirks are converted at this boundary: `numeric` columns are cast with `::float8`, and `date` columns come back as `YYYY-MM-DD` strings.
- **The pool** is created once in `db/pool.ts` and shared.
- `app.ts` builds the Express app, layering any middleware and general error handling, and `index.ts` starts the server listening. This way tests can import the app without starting a server.

A services layer between routes and repositories is deferred until a route needs to do more than validate, call the repository, and respond.

## Alternatives considered

- **SQL inside the route handlers:** the least code, but it mixes HTTP and data access, so neither can change or be tested separately.
- **`pg-promise`:** convenient transaction helpers, but a wrapper over `pg` that the API doesn't need yet.
- **A query builder (Kysely, Drizzle):** type-checked queries and easy dynamic filters, but one table and one static query don't justify the extra dependency and setup yet. Either would slot in behind the repository layer.
- **An ORM (Prisma, TypeORM):** hides the most SQL and brings its own schema language and client. That is more machinery than this API needs.

## Consequences

- The SQL is visible and easy to follow, and swapping the query approach later only touches `repositories/`.
- Route tests can mock the repository and run without a database.
- Hand-written SQL can only be verified against a real Postgres, so repository integration tests are needed. Until they exist, the repository and pool show as uncovered, deliberately.
