# 0014. Dependency install scripts blocked by default

- Status: Accepted
- Date: 2026-10-18

## Context

Moving to Node 24 brought npm 11.19, which no longer runs dependencies' install scripts (`preinstall`, `install`, `postinstall`) unless the project has approved them in an `allowScripts` field in `package.json`. Install scripts run arbitrary code at install time, on developer machines and in CI, and they are a common way for a compromised package to do harm.

Five installed packages have install scripts: `esbuild` (via tsx and Vitest), `unrs-resolver` (via ESLint's import resolver), `protobufjs`, `ssh2` and `cpu-features` (via Testcontainers). With all five skipped, a clean `npm ci` followed by typecheck, lint, the unit and integration tests, and both Docker stacks all work. Their scripts verify binaries or build optional native speed-ups that this project doesn't use.

## Decision

Keep npm's default: dependency install scripts don't run unless explicitly approved.

- Approve a package only after confirming it fails without its script, using `npm install-scripts approve <pkg>`. This pins the approval to the reviewed version, so an upgrade needs a fresh review.
- The production Docker install keeps `--ignore-scripts`, so it runs no install scripts regardless of approvals.
- The project's own `prepare` script (husky) is not a dependency script and still runs.

## Alternatives considered

- **Approve every package with a script (`npm install-scripts approve --all`):** restores npm 10's behavior with one command, but runs code nobody reviewed, including in future versions if the approvals aren't pinned.
- **Approve the five current packages:** nothing currently needs their scripts, so this would allow code to run for no benefit.
- **Stay on npm 10 behavior by pinning an older npm:** gives up the protection, and npm 10 ships with Node 22, which reaches end of life in April 2027.

## Consequences

- Installs run less third-party code, on machines and in CI.
- npm lists the skipped packages after each install. `npm install-scripts ls` shows them on demand.
- A new dependency that genuinely needs its install script, such as a native addon without prebuilt binaries, fails at runtime instead of at install. The fix is reviewing and approving that package.
- npm 10 still runs every install script. The root `engines` field asks for Node 24, but npm only warns when it doesn't match, so the protection depends on everyone using the Node version in `.nvmrc`. CI does.
- Revisit if a dependency needs its script, or if npm changes how approvals work.
