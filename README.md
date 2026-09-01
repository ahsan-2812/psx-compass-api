# PSX Compass API

Express and TypeScript API for PSX Compass, a Pakistan Stock Exchange portfolio-management and
investor platform.

## Stack

- Node.js 22+
- Express
- TypeScript
- Sequelize
- Microsoft SQL Server

## Local setup

1. Copy `.env.example` to `.env` and update the SQL Server credentials.
2. Create a SQL Server database named `psx_compass`.
3. Install dependencies with `npm install`.
4. Start development mode with `npm run dev`.

The server validates its configuration and SQL Server connection before accepting traffic.

## Commands

| Command                             | Purpose                                     |
| ----------------------------------- | ------------------------------------------- |
| `npm run dev`                       | Run the API with file watching              |
| `npm run build`                     | Compile production JavaScript               |
| `npm run typecheck`                 | Check TypeScript without emitting files     |
| `npm run lint`                      | Run ESLint                                  |
| `npm run format:check`              | Verify formatting                           |
| `npm run db:migrate`                | Apply all pending database migrations       |
| `npm run db:migrate:undo`           | Revert the latest database migration        |
| `npm run db:migrate:status`         | List applied and pending migrations         |
| `npm run db:verify:security-master` | Build and verify the security-master schema |
| `npm run db:verify:index-master`    | Build and verify the PSX index schema       |
| `npm test`                          | Run the test suite                          |

## Database migrations

Migrations live in `src/database/migrations` and are run explicitly; normal API startup never
applies them automatically. Configure the database in `.env`, then use:

```bash
npm run db:migrate
npm run db:migrate:undo
npm run db:migrate:status
```

Name migration files with a sortable UTC timestamp and a short kebab-case description, for
example `20260901120000-create-sectors.ts`. Each migration must export typed `up` and `down`
functions using the `Migration` type from `src/database/migrator.ts`. Never edit an already-applied
migration; create a new corrective migration instead.

Completed migrations are recorded in the `SequelizeMeta` table. Migration identities omit the
file extension, ensuring that development `.ts` files and compiled production `.js` files refer to
the same migration.

`npm run db:verify:security-master` first creates a fresh production build and then checks the
security-master schema and its `SequelizeMeta` record. It requires a configured local database and
the security-master migration to already be applied.

`npm run db:verify:index-master` builds the project and verifies the `indices` and
`index_constituents` tables, temporal constraints, foreign keys, indexes, filtered current-period
uniqueness, and migration record. It requires a configured local database with both the
security-master and index-master migrations already applied.

## Database models

Models live with their business module under `src/modules`. Each model exposes an explicit
initializer, while module-level initialization defines associations after all participating models
are registered. Database column names use snake case and TypeScript attributes use camel case.
Schema changes belong in migrations; the application must never use `sequelize.sync()`.

## Health endpoints

- `GET /api/v1/health/live` verifies that the API process is running.
- `GET /api/v1/health/ready` verifies that SQL Server is reachable.
