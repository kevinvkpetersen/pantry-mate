# 0015. Zod schemas in the shared types package

- Status: Accepted
- Date: 2026-10-22

## Context

`POST /items` needs its request body checked at runtime. The shared types from decision 0003 exist only at compile time, so they can't check anything, and the mobile app casts API responses to `PantryItem[]` without checking them either. A check written separately from the type it describes can drift from it.

Decision 0003 kept `@pantry-mate/types` types-only so it needed no build step, and said to revisit that once it held runtime code. A Zod schema is runtime code. Once the API imports one, the package is loaded at runtime, and the production API runs the compiled output on plain Node. Node loads a package through its `package.json` `exports` (or `main`), needs JavaScript there, and ignores the `types` field.

## Decision

Define the shared data shapes as Zod schemas in `@pantry-mate/types`, and infer the types from them (`z.infer`).

- **The package has a build.** `tsc` compiles `src` to CommonJS in `packages/types/dist`, with declaration files. The tsconfig extends `@tsconfig/node24` for its module and target settings, and sets `"types": []` so Node's globals don't type-check in code that also runs in the app.
- **`exports` describes both the source and the build.** A custom condition, `@pantry-mate/source`, points at `src/index.ts`. `types` and `default` point at `dist`. Tools that don't know the custom condition skip it, so plain Node, including the production image, loads `dist`.
- **Development tools read the source.** `tsx` gets `--conditions=@pantry-mate/source` (in the `dev` script and the Dockerfile's `dev` stage), the API and mobile tsconfigs set `customConditions`, and Vitest sets `ssr.resolve.conditions`. Development, typecheck and tests never need `dist`, and `tsx watch` restarts when a schema changes.
- **The condition name is scoped.** A condition applies to every package being resolved, so a generic name such as `source` could switch other packages to their own source files.
- **The production image builds and includes the package.** The Dockerfile's `build` stage runs the root `build`, and the `prod` stage copies `packages/types/dist` and its `package.json`.
- **Repositories parse their rows with the shared schemas**, so the API returns checked data.
- **Project-wide compiler rules move to a root `tsconfig.base.json`,** which each workspace extends together with its environment's base.

## Alternatives considered

- **Schemas in the API only:** keeps decision 0003 and needs no build step, but the app can't validate responses or forms with the same rules, and the schemas would have to move later with more code depending on them.
- **Hand-written validation:** no dependency and consistent with the config module, but the check and the type are written separately and can drift, and every new endpoint repeats the work.
- **Valibot, TypeBox or ArkType:** Valibot bundles smaller, which matters more in the app than the API. TypeBox's schemas are JSON Schema, which suits writing an OpenAPI document first. ArkType is fast but less widely used. Zod has the largest ecosystem and built-in JSON Schema output, which keeps generating OpenAPI from the schemas open.
- **`exports` pointing only at `src`:** works for every tool with a TypeScript compiler built in, but plain Node can't load it, so the production API can't start.
- **TypeScript `paths` instead of `exports`:** only TypeScript and tools that read the tsconfig use it. Plain Node and the compiled output don't, so production still fails, and the dev container would need the tsconfig files too.
- **Rebuilding `dist` in watch mode during development:** no custom condition, but one more process to keep running, and anything run before the first build fails.
- **ESM output:** Node 24 can `require()` an ES module, but a second module format adds cases to reason about. The API is CommonJS, and Metro reads CommonJS.

## Consequences

- One definition gives both the runtime check and the type, for the API and the app. The app's `fetchItems` can parse responses instead of casting them.
- Zod is a runtime dependency of the package. Code that only needs types uses `import type`, so it doesn't load Zod.
- Every tool that consumes the package needs the custom condition set, and a missing one shows up as "Cannot find module". Typecheck, tests and `tsx` all read the source, so a broken build or `exports` field only shows up when the production image starts. The CI `docker` job builds the image but doesn't run it yet.
- `verbatimModuleSyntax` is off in the package, because it doesn't allow ESM syntax in a CommonJS build.
- Vitest's `ssr.resolve.conditions` replaces Vite's defaults, so they're listed alongside the custom condition. Listing `import` explicitly breaks CommonJS packages that `require()` a package with separate builds: `pg` received `pg-pool`'s ESM build.
- Once schemas use defaults or transforms, a request body's type (`z.input`) and the stored type (`z.output`) differ.
- Metro hasn't been checked yet, because the app only imports types so far. Check it when the app first imports a schema.
- OpenAPI is deferred. Revisit it when there's a consumer other than this app, or a need for published API documentation.
