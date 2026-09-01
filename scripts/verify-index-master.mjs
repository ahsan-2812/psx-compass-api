import assert from 'node:assert/strict';
import console from 'node:console';

import { QueryTypes } from 'sequelize';

import { loadEnv } from '../dist/config/env.js';
import { createLogger } from '../dist/config/logger.js';
import { createSequelize } from '../dist/database/sequelize.js';

const migrationName = '20260901160000-create-index-master';
const env = loadEnv();
const database = createSequelize(env, createLogger({ ...env, LOG_LEVEL: 'silent' }));

try {
  const columns = await database.query(
    `SELECT t.name AS table_name, c.name AS column_name, ty.name AS data_type,
            c.precision, c.scale, c.is_nullable, c.is_identity
     FROM sys.tables t
     JOIN sys.columns c ON c.object_id = t.object_id
     JOIN sys.types ty ON ty.user_type_id = c.user_type_id
     WHERE t.name IN ('indices', 'index_constituents')`,
    { type: QueryTypes.SELECT },
  );
  const constraints = await database.query(
    `SELECT o.name, o.type
     FROM sys.objects o
     WHERE o.parent_object_id IN (OBJECT_ID('indices'), OBJECT_ID('index_constituents'))
       AND o.type IN ('C', 'F')`,
    { type: QueryTypes.SELECT },
  );
  const indexes = await database.query(
    `SELECT t.name AS table_name, i.name, i.is_unique, i.has_filter, i.filter_definition
     FROM sys.tables t
     JOIN sys.indexes i ON i.object_id = t.object_id
     WHERE t.name IN ('indices', 'index_constituents') AND i.name IS NOT NULL`,
    { type: QueryTypes.SELECT },
  );
  const foreignKeys = await database.query(
    `SELECT name, delete_referential_action_desc, update_referential_action_desc
     FROM sys.foreign_keys
     WHERE parent_object_id = OBJECT_ID('index_constituents')`,
    { type: QueryTypes.SELECT },
  );
  const migrationRecords = await database.query(
    'SELECT name FROM SequelizeMeta WHERE name = :name',
    {
      replacements: { name: migrationName },
      type: QueryTypes.SELECT,
    },
  );

  const constituentCompanyId = columns.find(
    ({ table_name, column_name }) =>
      table_name === 'index_constituents' && column_name === 'company_id',
  );
  const constituentWeight = columns.find(
    ({ table_name, column_name }) =>
      table_name === 'index_constituents' && column_name === 'weight_percentage',
  );
  const constraintNames = new Set(constraints.map(({ name }) => name));
  const indexNames = new Set(indexes.map(({ name }) => name));
  const currentUniqueIndex = indexes.find(({ name }) => name === 'index_constituents_current_uq');

  assert.equal(columns.filter(({ table_name }) => table_name === 'indices').length, 9);
  assert.equal(columns.filter(({ table_name }) => table_name === 'index_constituents').length, 10);
  assert.equal(constituentCompanyId?.data_type, 'uniqueidentifier');
  assert.equal(constituentWeight?.data_type, 'decimal');
  assert.equal(constituentWeight?.precision, 7);
  assert.equal(constituentWeight?.scale, 4);

  for (const name of [
    'indices_index_type_ck',
    'index_constituents_index_id_fk',
    'index_constituents_company_id_fk',
    'index_constituents_effective_dates_ck',
    'index_constituents_weight_percentage_ck',
  ]) {
    assert(constraintNames.has(name), `Missing constraint ${name}`);
  }
  for (const name of [
    'indices_code_uq',
    'indices_name_uq',
    'indices_index_type_idx',
    'indices_is_active_idx',
    'index_constituents_index_id_idx',
    'index_constituents_company_id_idx',
    'index_constituents_effective_dates_idx',
    'index_constituents_current_lookup_idx',
    'index_constituents_period_uq',
    'index_constituents_current_uq',
  ]) {
    assert(indexNames.has(name), `Missing index ${name}`);
  }
  assert.equal(currentUniqueIndex?.is_unique, true);
  assert.equal(currentUniqueIndex?.has_filter, true);
  assert.match(currentUniqueIndex?.filter_definition ?? '', /effective_to.*IS NULL/i);
  assert.equal(foreignKeys.length, 2);
  for (const foreignKey of foreignKeys) {
    assert.equal(foreignKey.delete_referential_action_desc, 'NO_ACTION');
    assert.equal(foreignKey.update_referential_action_desc, 'NO_ACTION');
  }
  assert.equal(migrationRecords[0]?.name, migrationName);

  console.log(
    JSON.stringify({
      tables: ['indices', 'index_constituents'],
      columnCounts: { indices: 9, indexConstituents: 10 },
      constraints: [...constraintNames].sort(),
      indexes: [...indexNames].sort(),
      currentMembershipFilter: currentUniqueIndex.filter_definition,
      foreignKeyDeleteActions: foreignKeys.map(({ name, delete_referential_action_desc }) => ({
        name,
        action: delete_referential_action_desc,
      })),
      migration: migrationRecords[0].name,
    }),
  );
} finally {
  await database.close();
}
