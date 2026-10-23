# 0003. Shared types package without a build step

- Status: Superseded by [0015](0015-zod-schemas-in-the-shared-types-package.md)
- Date: 2026-10-09

## Context

The API and the mobile app need to agree on the shape of the data that crosses the HTTP boundary (eg. `PantryItem`). A change on one side shouldn't be able to drift from the other without the compiler noticing.

## Decision

Put the shared types in a workspace package, `@pantry-mate/types`, and point its `types` field straight at the TypeScript source (`src/index.ts`). The package contains only types, which exist at compile time and disappear at runtime, so there is nothing to build. Consumers import with `import type`, so the import is erased and neither the compiled API nor Metro ever loads the `.ts` file.

Types that belong to one sub-project stay in that sub-project's workspace. The API's `Config` type holds a database password, so it lives in the API and not in this package.

## Alternatives considered

- **Duplicating the types in each app:** no setup, but the two copies drift apart without anyone noticing.
- **A package with a build step:** emits JavaScript and declaration files into `dist`. It is required once the package holds runtime code, but it is one more thing to keep in sync while the package is types only.
- **Generating types from a schema (OpenAPI, or a validation library):** one definition for both the check and the type. It is a reasonable next step, but it adds a dependency and tooling before there is a request body to validate.

## Consequences

- There is no build to run or forget, and an edit to a type shows up in both apps immediately.
- `import type` is required, and the `verbatimModuleSyntax` setting enforces it.
- Types are not checked at runtime. The app's `fetchItems` casts the response to `PantryItem[]`, which is a promise to the compiler and not a check.
- If runtime code such as validation schemas is added, the package needs a build step and its `main` and `types` fields need to point at the output. Revisit at that point.
