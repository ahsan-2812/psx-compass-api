import type { QueryInterface, Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import type { MigrationFn, MigrationParams, RunnableMigration } from 'umzug';

import type { AppLogger } from '../config/logger.js';

export type Migration = MigrationFn<QueryInterface>;
export const migrationMetaTableName = 'SequelizeMeta';

export function normalizeMigrationName(name: string): string {
  return name.replace(/\.(?:[cm]?[jt]s)$/iu, '');
}

export function getMigrationGlob(moduleUrl: string): string {
  return moduleUrl.endsWith('.ts') ? 'migrations/*.ts' : 'migrations/*.js';
}

function resolveMigration(
  params: MigrationParams<QueryInterface>,
): RunnableMigration<QueryInterface> {
  return Umzug.defaultResolver({
    ...params,
    name: normalizeMigrationName(params.name),
  });
}

export function createMigrator(database: Sequelize, logger: AppLogger): Umzug<QueryInterface> {
  return new Umzug({
    migrations: {
      glob: [getMigrationGlob(import.meta.url), { cwd: import.meta.dirname }],
      resolve: resolveMigration,
    },
    context: database.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: database, tableName: migrationMetaTableName }),
    logger,
  });
}
