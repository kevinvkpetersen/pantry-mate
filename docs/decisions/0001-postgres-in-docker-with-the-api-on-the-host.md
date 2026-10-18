# 0001. Postgres in Docker, with the API on the host

- Status: Superseded by [0013](0013-api-in-a-container-during-development.md)
- Date: 2026-10-08

## Context

The app needs a Postgres database that is the same on every machine and easy to reset. The mobile app can't practically run in a container, and the API is still small enough that the fastest possible edit and debug loop matters more than matching a production container.

## Decision

Docker Compose contains configuration for Postgres:

- The image is pinned to a major version (`postgres:18`) so a new release can't change the data layout unexpectedly.
- Data lives in a named volume, mounted at `/var/lib/postgresql`, which is where Postgres 18 images expect it.
- The port is bound to `127.0.0.1`, so the database isn't exposed to the local network.
- Credentials come from the root `.env`, with Compose refusing to start if one is missing.
- The schema and seed data are loaded from `docker/db/init/`.

The API and the mobile app run on the host. The API reads the database host from `POSTGRES_HOST` in `.env`, which defaults to `localhost`.

## Alternatives considered

- **Putting the API in a container as well:** closer to production, and a dev container makes debugging reproducible. It is planned, and the `POSTGRES_HOST` variable exists so the API can reach the database by its Compose service name. It was deferred because it adds a Dockerfile, a build context, and debug configuration before they pay off.
- **A locally installed Postgres:** no Docker, but versions and settings differ between machines, and resetting the database is manual.
- **Docker secrets for credentials:** the right tool for production, but more than local development needs. A git-ignored `.env` is enough here.

## Consequences

- The edit and debug loop for the API is as fast as it can be.
- Init scripts only run when the data volume is empty, so changing the schema means `npm run db:reset`, which deletes the data. Migrations are needed once data has to survive a schema change.
- Under Docker Desktop, bind mounts only work for folders the VM can see, so the repository has to live on the main disk. A repo on a mounted external drive produced an empty init folder inside the container.
- Revisit when the API is containerized, and again when migrations replace the init scripts.
