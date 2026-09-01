import assert from 'node:assert/strict';
import console from 'node:console';

import { QueryTypes } from 'sequelize';

import { loadEnv } from '../dist/config/env.js';
import { createLogger } from '../dist/config/logger.js';
import { createSequelize } from '../dist/database/sequelize.js';

const migrationName = '20260901150000-create-security-master';
const env = loadEnv();
const database = createSequelize(env, createLogger({ ...env, LOG_LEVEL: 'silent' }));

try {
  const columns = await database.query(
    `SELECT
       t.name AS table_name,
       c.name AS column_name,
       ty.name AS data_type,
       c.is_nullable,
       c.is_identity,
       dc.definition AS default_definition
     FROM sys.tables t
     JOIN sys.columns c ON c.object_id = t.object_id
     JOIN sys.types ty ON ty.user_type_id = c.user_type_id
     LEFT JOIN sys.default_constraints dc ON dc.object_id = c.default_object_id
     WHERE t.name IN ('sectors', 'companies')`,
    { type: QueryTypes.SELECT },
  );
  const constraints = await database.query(
    `SELECT o.name, o.type
     FROM sys.objects o
     WHERE o.parent_object_id IN (OBJECT_ID('sectors'), OBJECT_ID('companies'))
       AND o.type IN ('C', 'F')`,
    { type: QueryTypes.SELECT },
  );
  const indexes = await database.query(
    `SELECT t.name AS table_name, i.name, i.is_unique
     FROM sys.tables t
     JOIN sys.indexes i ON i.object_id = t.object_id
     WHERE t.name IN ('sectors', 'companies') AND i.name IS NOT NULL`,
    { type: QueryTypes.SELECT },
  );
  const foreignKeys = await database.query(
    `SELECT name, delete_referential_action_desc, update_referential_action_desc
     FROM sys.foreign_keys
     WHERE parent_object_id = OBJECT_ID('companies')`,
    { type: QueryTypes.SELECT },
  );
  const migrationRecords = await database.query(
    'SELECT name FROM SequelizeMeta WHERE name = :name',
    {
      replacements: { name: migrationName },
      type: QueryTypes.SELECT,
    },
  );

  const companyId = columns.find(
    (column) => column.table_name === 'companies' && column.column_name === 'id',
  );
  const sectorId = columns.find(
    (column) => column.table_name === 'sectors' && column.column_name === 'id',
  );
  const constraintNames = new Set(constraints.map(({ name }) => name));
  const indexNames = new Set(indexes.map(({ name }) => name));

  assert.equal(columns.filter(({ table_name }) => table_name === 'sectors').length, 6);
  assert.equal(columns.filter(({ table_name }) => table_name === 'companies').length, 15);
  assert.equal(companyId?.data_type, 'uniqueidentifier');
  assert.match(companyId?.default_definition ?? '', /newsequentialid/i);
  assert.equal(sectorId?.is_identity, true);
  assert.deepEqual(
    constraintNames,
    new Set([
      'companies_listing_status_ck',
      'companies_sector_id_fk',
      'companies_security_type_ck',
      'companies_shariah_status_ck',
      'companies_valuation_engine_ck',
    ]),
  );
  for (const name of [
    'companies_listing_status_idx',
    'companies_sector_id_idx',
    'companies_shariah_status_idx',
    'companies_symbol_uq',
    'companies_valuation_engine_idx',
    'sectors_code_uq',
    'sectors_name_uq',
  ]) {
    assert(indexNames.has(name), `Missing index ${name}`);
  }
  assert.equal(foreignKeys[0]?.delete_referential_action_desc, 'NO_ACTION');
  assert.equal(migrationRecords[0]?.name, migrationName);

  console.log(
    JSON.stringify({
      tables: ['sectors', 'companies'],
      columnCounts: { sectors: 6, companies: 15 },
      companyId: {
        type: companyId.data_type,
        default: companyId.default_definition,
      },
      constraints: [...constraintNames].sort(),
      indexes: [...indexNames].sort(),
      foreignKeyDeleteAction: foreignKeys[0].delete_referential_action_desc,
      migration: migrationRecords[0].name,
    }),
  );
} finally {
  await database.close();
}
