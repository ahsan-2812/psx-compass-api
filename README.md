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

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Run the API with file watching          |
| `npm run build`        | Compile production JavaScript           |
| `npm run typecheck`    | Check TypeScript without emitting files |
| `npm run lint`         | Run ESLint                              |
| `npm run format:check` | Verify formatting                       |
| `npm test`             | Run the test suite                      |

## Health endpoints

- `GET /api/v1/health/live` verifies that the API process is running.
- `GET /api/v1/health/ready` verifies that SQL Server is reachable.
