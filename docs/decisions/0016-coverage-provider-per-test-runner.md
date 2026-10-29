# 0016. Coverage provider per test runner

- Status: Accepted
- Date: 2026-10-28

## Context

Decision 0008 says coverage uses the v8 provider, and that test files import `describe`, `it` and `expect` explicitly. Both were written for the API, before the mobile tests existed. Jest, through `jest-expo`, defaults to its babel provider, which is Istanbul: it adds counters to the code while Babel compiles it. Vitest defaults to v8, which reads the coverage the JavaScript engine collects and maps it back to the source through source maps.

Each provider was tried in each app. A test file was skipped, so there was untested code, and the reports were compared.

- **Mobile:** with `InventoryList.test.tsx` skipped, v8 marked the error `return` and the `.catch` callback as covered, though neither ran. It reported 97.7% of lines, 87.5% of branches and 100% of functions, where babel reported 86.7%, 50% and 83.3%. jest-expo compiles every file with Babel, and v8's mapping back through it goes wrong around JSX. v8 was also slower, about 1.6 to 2.7 seconds against 1.4.
- **API:** with `routes/items.test.ts` or `server/shutdown.test.ts` skipped, v8 and Istanbul found the same untested code. Istanbul also counts default parameter values (`emitter = process`) as branches, and doesn't read `v8 ignore` comments. Speed was about the same.

## Decision

Each app uses its test runner's default coverage provider: v8 in the API, and babel (Istanbul) in mobile.

This supersedes 0008 and carries the rest of it forward unchanged: Vitest, with supertest, in the API, and Jest with `jest-expo` in mobile. Coverage stays on by default in `npm test`, and off in watch mode in both apps. Watch mode runs only some of the tests: only the unit tests in the API, and only those related to changed files in mobile. Its table then lists only the files those tests load, so the numbers would mislead. 0008's reasoning and alternatives still apply.

Test imports follow each runner's default. Vitest has no globals by default, so the API's tests import `describe`, `it` and `expect` from `vitest`. Jest provides globals, typed by `@types/jest`, so the mobile tests use them without imports.

## Alternatives considered

- **v8 in both:** one provider across the repo, but it overstates mobile coverage, so code can look tested when it isn't.
- **Istanbul in both:** one provider and one style of ignore comment, but the API needs a new dependency (`@vitest/coverage-istanbul`) and its `v8 ignore` comments rewritten, for no gain in what the coverage catches.

## Consequences

- Each app's coverage is as accurate as its toolchain allows, with no extra configuration or dependencies.
- Ignore comments differ by app: `/* v8 ignore */` in the API and `/* istanbul ignore */` in mobile.
- The two apps' percentages aren't strictly comparable, because Istanbul counts some constructs, such as default parameter values, that v8 doesn't.
- Revisit if jest-expo changes its compilation, or if a new version of v8's source-map remapping handles Babel-compiled JSX accurately.
