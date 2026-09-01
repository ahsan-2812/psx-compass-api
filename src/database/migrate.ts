import { pathToFileURL } from 'node:url';

import { loadEnv } from '../config/env.js';
import { createLogger } from '../config/logger.js';
import { createMigrator } from './migrator.js';
import { createSequelize } from './sequelize.js';

const supportedCommands = ['up', 'down', 'status'] as const;
type MigrationCommand = (typeof supportedCommands)[number];

export function parseMigrationCommand(value: string | undefined): MigrationCommand {
  const command = value ?? 'up';

  if (supportedCommands.some((supportedCommand) => supportedCommand === command)) {
    return command as MigrationCommand;
  }

  throw new Error(
    `Unsupported migration command "${command}". Expected one of: ${supportedCommands.join(', ')}.`,
  );
}

async function run(): Promise<void> {
  const command = parseMigrationCommand(process.argv[2]);
  const env = loadEnv();
  const logger = createLogger(env);
  const database = createSequelize(env, logger);
  const migrator = createMigrator(database, logger);

  try {
    await database.authenticate();

    if (command === 'up') {
      const migrations = await migrator.up();
      logger.info({ migrations: migrations.map(({ name }) => name) }, 'Migrations applied');
      return;
    }

    if (command === 'down') {
      const migrations = await migrator.down();
      logger.info({ migrations: migrations.map(({ name }) => name) }, 'Migration reverted');
      return;
    }

    const [executed, pending] = await Promise.all([migrator.executed(), migrator.pending()]);
    logger.info(
      {
        executed: executed.map(({ name }) => name),
        pending: pending.map(({ name }) => name),
      },
      'Migration status',
    );
  } finally {
    await database.close();
  }
}

const entryPoint = process.argv[1];

if (entryPoint && pathToFileURL(entryPoint).href === import.meta.url) {
  run().catch((error: unknown) => {
    console.error('Migration command failed', error);
    process.exitCode = 1;
  });
}
