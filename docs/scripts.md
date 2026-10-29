# Scripts

Run these from the repo root. Commands that work across the repo run in every workspace that defines the script, and skip the rest. `-w` selects a single workspace.

| Command                             | What it does                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm start`                         | Build if needed, then start Postgres and the API in Docker, with the API in development mode           |
| `npm run logs`                      | Follow the API container's logs, formatted by `pino-pretty`                                            |
| `npm run start:prod`                | Rebuild and start the production-like stack (`compose.yml` only)                                       |
| `npm stop`                          | Stop either stack (`docker compose down`)                                                              |
| `npm run db:reset`                  | Delete the database volume, then start the stack again, recreating the database from `docker/db/init/` |
| `npm test`                          | Run the tests in every workspace, with coverage                                                        |
| `npm run typecheck`                 | `tsc --noEmit` in every workspace                                                                      |
| `npm run lint`                      | ESLint in every workspace                                                                              |
| `npm run lint:fix`                  | ESLint with autofix in every workspace                                                                 |
| `npm run build`                     | Build every workspace that has a build: the API and `@pantry-mate/types`                               |
| `npm run format`                    | Format the repo with Prettier                                                                          |
| `npm run format:check`              | Check formatting without changing files                                                                |
| `npm run -w apps/api dev`           | API on your machine in watch mode, with logs formatted by `pino-pretty`. Stop the API container first. |
| `npm run -w apps/api build`         | Compile the API to `apps/api/dist`                                                                     |
| `npm run -w apps/api test:unit`     | API unit tests only, without Docker                                                                    |
| `npm run -w apps/api test:int`      | API integration tests only (needs Docker)                                                              |
| `npm run -w apps/api test:watch`    | Re-run the API unit tests on change, without coverage                                                  |
| `npm run -w apps/mobile start`      | Expo dev server                                                                                        |
| `npm run -w apps/mobile test`       | Mobile tests only, with coverage                                                                       |
| `npm run -w apps/mobile test:watch` | Re-run the mobile tests on change, without coverage                                                    |

`npm start` rebuilds the API image when dependencies or `package.json` have changed, and reuses Docker's cache otherwise, so run it again after changing any of those.

`npm run db:reset` deletes the database's data. Use it when you change the schema or seed scripts, and not when you want to keep what's in the database.
