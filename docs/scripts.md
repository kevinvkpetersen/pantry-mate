# Scripts

Run these from the repo root. Commands that work across the repo run in every workspace that defines the script, and skip the rest. `-w` selects a single workspace.

| Command                          | What it does                                                      |
| -------------------------------- | ----------------------------------------------------------------- |
| `npm start`                      | Start the Docker services (`docker compose up -d`)                |
| `npm stop`                       | Stop them (`docker compose down`)                                 |
| `npm run db:reset`               | Delete the database volume and recreate it from `docker/db/init/` |
| `npm test`                       | Run the tests in every workspace, with coverage                   |
| `npm run typecheck`              | `tsc --noEmit` in every workspace                                 |
| `npm run lint`                   | ESLint in every workspace                                         |
| `npm run lint:fix`               | ESLint with autofix in every workspace                            |
| `npm run format`                 | Format the repo with Prettier                                     |
| `npm run format:check`           | Check formatting without changing files                           |
| `npm run -w apps/api dev`        | API in watch mode                                                 |
| `npm run -w apps/api build`      | Compile the API to `apps/api/dist`                                |
| `npm run -w apps/api test:watch` | Re-run the API tests on change, without coverage                  |
| `npm run -w apps/mobile start`   | Expo dev server                                                   |

`npm run db:reset` deletes the database's data. Use it when you change the schema or seed scripts, and not when you want to keep what's in the database.
