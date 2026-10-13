# 0007. `UNLICENSED`, all rights reserved

- Status: Accepted
- Date: 2026-10-10

## Context

Code with no license is all rights reserved by default, and a public repository doesn't change that, but making the current license restrictions explicit will remove any ambiguity. Whether and how to open the source can be decided later.

## Decision

Stated plainly:

- A root `LICENSE` file saying the code is proprietary and all rights are reserved.
- `"license": "UNLICENSED"` in each `package.json`, the npm convention for "not licensed to anyone".
- `"private": true` in each `package.json`, so nothing can be published to npm by accident.
- A one-line license note in the README.

## Alternatives considered

- **MIT:** permissive, anyone can use the code with a copyright notice. The most common choice, but it gives away rights that can't be taken back.
- **Apache-2.0:** similar to MIT, with an explicit patent grant.
- **GPL-3.0 or AGPL-3.0:** copyleft licenses that require derivatives to stay open. The AGPL extends that to software run as a network service, which would cover this API.

## Consequences

- Nobody else may use, copy, or modify the code without permission.
- It can be relaxed later, because the copyright holder is the only contributor. Once outside contributors have contributed under a license, relicensing needs their agreement.
