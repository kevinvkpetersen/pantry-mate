# 0004. Monorepo with npm workspaces

- Status: Accepted
- Date: 2026-10-09

## Context

The project has a React Native mobile app, an Express API, and types that both need to agree on (the shape of a pantry item crossing the HTTP boundary). It is maintained by one developer, so the setup should be simple to run and the reasoning behind it easy to read.

## Decision

Keep everything in one repository, managed with npm workspaces:

- `apps/` holds things that run: `api` and `mobile`.
- `packages/` holds things that are imported: `types` (`@pantry-mate/types`).
- The root owns shared tooling (ESLint, Prettier, TypeScript, Husky) and scripts that fan out to every workspace with `--workspaces --if-present`.

## Alternatives considered

- **Separate repositories:** the shared types would have to be published or copied, and a change that touches the API and the app would need coordinated pull requests. That is overhead with no benefit for one developer.
- **pnpm workspaces:** faster installs and stricter dependency isolation, but its non-flat `node_modules` layout commonly needs extra configuration to work with React Native's Metro bundler. npm's default layout works with Expo's monorepo support as it is.
- **Yarn workspaces:** broadly equivalent to npm workspaces, so there was no reason to add another package manager.
- **Nx or Turborepo:** task caching and orchestration. They solve build-time problems that three small packages don't have, and either can be layered on top of npm workspaces later.

## Consequences

- One install and one lockfile cover the whole repo, and local packages are linked by name, so `import type { PantryItem } from '@pantry-mate/types'` works in both apps without publishing anything.
- Lint, format, and TypeScript settings live in one place, and CI runs the same root scripts a developer runs locally.
- Hoisting puts dependencies in the root `node_modules`, so a package can accidentally import something it never declared. Each package's `package.json` is the source of truth for what it depends on.
- Docker builds for the API will need the repository root as the build context, so they can see `packages/`.
- Revisit if installs or CI get slow, or if the number of packages grows enough that caching and task orchestration would pay for themselves.
