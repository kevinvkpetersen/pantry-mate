# 0008. Vitest for the API, Jest for mobile

- Status: Superseded by [0016](0016-coverage-provider-per-test-runner.md)
- Date: 2026-10-10

## Context

The API is TypeScript running on Node and needs unit tests that run quickly, including in CI. The mobile app is Expo, whose testing documentation is built around Jest and the `jest-expo` preset.

## Decision

Use Vitest, with supertest for HTTP requests, in the API. Use Jest with `jest-expo` in the mobile app when its tests are added. Coverage uses the v8 provider and is on by default in `npm test`, and off in watch mode so reruns stay quick and uncluttered.

## Alternatives considered

- **Jest for both:** one runner and one set of mock functions across the repo. The API would need a TypeScript transform (`ts-jest` or SWC) and a config file, and Jest's handling of ES modules is still awkward. The speed difference at this size is minimal, but Vitest has a more direct setup for this project.
- **Vitest for both:** one runner, but Expo's testing tooling expects Jest, so mobile would fight its own ecosystem.

## Consequences

- Vitest runs TypeScript with no transform configuration, and its API is nearly the same as Jest's, so knowledge carries across (`vi.fn` and `jest.fn`).
- Two test runners live in one repo, which is a small, real cost.
- Test files are imported explicitly (`import { describe, it, expect } from 'vitest'`) instead of using globals, so ESLint and TypeScript need no extra configuration.
- Revisit if maintaining two runners becomes a burden, or if Expo's testing guidance changes.
