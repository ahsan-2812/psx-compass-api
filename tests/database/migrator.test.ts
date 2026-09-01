import { SequelizeStorage } from 'umzug';
import { describe, expect, it } from 'vitest';

import {
  createMigrator,
  getMigrationGlob,
  migrationMetaTableName,
  normalizeMigrationName,
} from '../../src/database/migrator.js';
import { createDisconnectedTestDatabase, testLogger } from '../helpers/test-dependencies.js';

describe('migration configuration', () => {
  it('uses the runtime-appropriate migration file extension', () => {
    expect(getMigrationGlob('file:///app/src/database/migrator.ts')).toBe('migrations/*.ts');
    expect(getMigrationGlob('file:///app/dist/database/migrator.js')).toBe('migrations/*.js');
  });

  it.each([
    ['20260901120000-create-users.ts', '20260901120000-create-users'],
    ['20260901120000-create-users.js', '20260901120000-create-users'],
    ['20260901120000-create-users.mts', '20260901120000-create-users'],
    ['20260901120000-create-users.mjs', '20260901120000-create-users'],
  ])('normalizes %s to %s', (filename, expected) => {
    expect(normalizeMigrationName(filename)).toBe(expected);
  });

  it('uses SequelizeStorage backed by SequelizeMeta', async () => {
    const database = createDisconnectedTestDatabase();

    try {
      const migrator = createMigrator(database, testLogger);

      expect(migrator.options.storage).toBeInstanceOf(SequelizeStorage);
      expect((migrator.options.storage as SequelizeStorage).tableName).toBe(migrationMetaTableName);
      expect(migrator.options.context).toBe(database.getQueryInterface());
    } finally {
      await database.close();
    }
  });
});
