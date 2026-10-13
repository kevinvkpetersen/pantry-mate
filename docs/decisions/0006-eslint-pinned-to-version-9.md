# 0006. ESLint pinned to version 9

- Status: Accepted
- Date: 2026-10-10

## Context

The repo uses one ESLint configuration at the root for the API, the shared types, and the mobile app. The mobile app is linted with `eslint-config-expo`, which bundles `eslint-plugin-react` and `eslint-plugin-import`. The repo started on ESLint 10, but both of those plugins declare peer ranges that stop at ESLint 9, and running the Expo config under ESLint 10 crashed on the first file with an error inside `eslint-plugin-react`. ESLint 10 removed an API those plugins still call.

## Decision

Pin `eslint` and `@eslint/js` to version 9. Nothing in the setup depends on an ESLint 10 feature, and all of the currently used plugins and rules packages support 9.

## Alternatives considered

- **Stay on ESLint 10 and drop Expo's config:** build the mobile rules by hand from typescript-eslint and `eslint-plugin-react-hooks`. That means maintaining rules the Expo config already gets right.
- **Override the peer dependency ranges:** this hides the install warning, but doesn't fix the removed API, so the lint run still crashes.
- **Keep a separate lint setup for mobile:** it would avoid the conflict, but splits the rules the API and mobile share, such as the ban on `any`.

## Consequences

- One ESLint configuration covers the whole repo, including the type-aware rules that ban `any`.
- The repo stays one major version behind. This is low risk, since ESLint 9 is a supported release.
- Revisit when `eslint-config-expo` and its bundled plugins declare support for ESLint 10. Then upgrade, and check that `npm ls eslint` shows a single copy.
