# Decision log

Short records of the significant technical decisions in this project: what was chosen, what was rejected, and why. The format is a lightweight architecture decision record (ADR).

## Decisions

| #                                                           | Title                                        | Status   |
| ----------------------------------------------------------- | -------------------------------------------- | -------- |
| [0001](0001-postgres-in-docker-with-the-api-on-the-host.md) | Postgres in Docker, with the API on the host | Accepted |
| [0002](0002-layered-api-with-plain-pg.md)                   | Layered API with plain `pg`                  | Accepted |
| [0003](0003-shared-types-package-without-a-build-step.md)   | Shared types package without a build step    | Accepted |
| [0004](0004-monorepo-with-npm-workspaces.md)                | Monorepo with npm workspaces                 | Accepted |
| [0005](0005-expo-over-bare-react-native.md)                 | Expo over bare React Native                  | Accepted |
| [0006](0006-eslint-pinned-to-version-9.md)                  | ESLint pinned to version 9                   | Accepted |
| [0007](0007-unlicensed-all-rights-reserved.md)              | `UNLICENSED`, all rights reserved            | Accepted |
| [0008](0008-vitest-for-the-api-jest-for-mobile.md)          | Vitest for the API, Jest for mobile          | Accepted |
| [0009](0009-testcontainers-for-integration-tests.md)        | Testcontainers for integration tests         | Accepted |
| [0010](0010-single-readiness-style-health-endpoint.md)      | Single readiness-style health endpoint       | Accepted |
| [0011](0011-graceful-shutdown-with-a-drain-delay.md)        | Graceful shutdown with a drain delay         | Accepted |
| [0012](0012-structured-logging-with-pino.md)                | Structured logging with pino                 | Accepted |

## Adding a decision

1. Copy the template below to `NNNN-short-title.md`, using the next number.
2. Fill it in. Keep it short. A few sentences per section is enough.
3. Add a row to the table above.

Statuses are `Proposed`, `Accepted`, `Deprecated`, or `Superseded by NNNN`. Don't rewrite an accepted decision when circumstances change. Write a new one that supersedes it and update the old one's status, so the history stays readable.

## Template

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Deprecated | Superseded by NNNN
- Date: YYYY-MM-DD

## Context

What problem or choice came up, and what constraints applied.

## Decision

What was chosen, in one or two sentences.

## Alternatives considered

- **Option A:** why not.
- **Option B:** why not.

## Consequences

What this makes easier, what it costs, and when to revisit it.
```
