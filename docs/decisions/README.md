# Decision log

Short records of the significant technical decisions in this project: what was chosen, what was rejected, and why. The format is a lightweight architecture decision record (ADR).

## Decisions

| #                                                           | Title                                        | Status   |
| ----------------------------------------------------------- | -------------------------------------------- | -------- |
| [0001](0001-postgres-in-docker-with-the-api-on-the-host.md) | Postgres in Docker, with the API on the host | Accepted |

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
