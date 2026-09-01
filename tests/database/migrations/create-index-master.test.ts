import type { QueryInterface, Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { describe, expect, it } from 'vitest';

import {
  down,
  up,
} from '../../../src/database/migrations/20260901160000-create-index-master.js';

type ColumnDefinition = { type?: unknown };
type TableColumns = Record<string, ColumnDefinition>;
type ConstraintOptions = {
  name?: string;
  type?: string;
  onDelete?: string;
  onUpdate?: string;
  where?: Record<PropertyKey, unknown>;
};
type IndexOptions = {
  name?: string;
  unique?: boolean;
  where?: Record<string, unknown>;
};

function createQueryInterfaceMock() {
  const createTableCalls: Array<[string, TableColumns]> = [];
  const constraintCalls: Array<[string, ConstraintOptions]> = [];
  const indexCalls: Array<[string, string[], IndexOptions]> = [];
  const dropTableCalls: string[] = [];
  const transaction = {} as Transaction;

  const queryInterface = {
    createTable: (table: unknown, columns: unknown) => {
      createTableCalls.push([String(table), columns as TableColumns]);
      return Promise.resolve();
    },
    addConstraint: (table: unknown, options: unknown) => {
      constraintCalls.push([String(table), options as ConstraintOptions]);
      return Promise.resolve();
    },
    addIndex: (table: unknown, fields: unknown, options: unknown) => {
      indexCalls.push([String(table), fields as string[], options as IndexOptions]);
      return Promise.resolve();
    },
    dropTable: (table: unknown) => {
      dropTableCalls.push(String(table));
      return Promise.resolve();
    },
    sequelize: {
      transaction: (callback: (value: Transaction) => Promise<void>) => callback(transaction),
    },
  };

  return {
    queryInterface: queryInterface as unknown as QueryInterface,
    createTableCalls,
    constraintCalls,
    indexCalls,
    dropTableCalls,
  };
}

describe('create index master migration', () => {
  it('creates the tables in dependency order with the required columns', async () => {
    const mocks = createQueryInterfaceMock();

    await up({ name: 'create-index-master', context: mocks.queryInterface });

    expect(mocks.createTableCalls.map(([table]) => table)).toEqual([
      'indices',
      'index_constituents',
    ]);

    const indexColumns = mocks.createTableCalls[0]?.[1];
    const constituentColumns = mocks.createTableCalls[1]?.[1];
    expect(Object.keys(indexColumns ?? {})).toEqual([
      'id',
      'code',
      'name',
      'index_type',
      'is_active',
      'data_source',
      'source_updated_at',
      'created_at',
      'updated_at',
    ]);
    expect(Object.keys(constituentColumns ?? {})).toEqual([
      'id',
      'index_id',
      'company_id',
      'effective_from',
      'effective_to',
      'weight_percentage',
      'data_source',
      'source_updated_at',
      'created_at',
      'updated_at',
    ]);
    expect(constituentColumns?.company_id?.type).toBe('UNIQUEIDENTIFIER');
    expect(String(constituentColumns?.weight_percentage?.type)).toBe('DECIMAL(7,4)');
  });

  it('adds foreign keys and database check constraints', async () => {
    const mocks = createQueryInterfaceMock();

    await up({ name: 'create-index-master', context: mocks.queryInterface });

    const constraints = mocks.constraintCalls.map(([table, options]) => ({ table, ...options }));
    expect(constraints.map(({ name }) => name)).toEqual([
      'indices_index_type_ck',
      'index_constituents_index_id_fk',
      'index_constituents_company_id_fk',
      'index_constituents_effective_dates_ck',
      'index_constituents_weight_percentage_ck',
    ]);

    for (const name of ['index_constituents_index_id_fk', 'index_constituents_company_id_fk']) {
      expect(constraints.find((constraint) => constraint.name === name)).toMatchObject({
        type: 'foreign key',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      });
    }

    for (const name of [
      'index_constituents_effective_dates_ck',
      'index_constituents_weight_percentage_ck',
    ]) {
      const checkConstraint = constraints.find((constraint) => constraint.name === name);
      expect(Object.getOwnPropertySymbols(checkConstraint?.where ?? {})).toContain(Op.or);
    }
  });

  it('adds lookup, period uniqueness, and filtered current-membership indexes', async () => {
    const mocks = createQueryInterfaceMock();

    await up({ name: 'create-index-master', context: mocks.queryInterface });

    const indexes = mocks.indexCalls.map(([table, fields, options]) => ({
      table,
      fields,
      ...options,
    }));
    expect(indexes.map(({ name }) => name)).toEqual([
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
    ]);
    expect(indexes.find(({ name }) => name === 'index_constituents_period_uq')).toMatchObject({
      unique: true,
      fields: ['index_id', 'company_id', 'effective_from', 'effective_to'],
    });
    expect(indexes.find(({ name }) => name === 'index_constituents_current_uq')).toMatchObject({
      unique: true,
      fields: ['index_id', 'company_id'],
      where: { effective_to: null },
    });
  });

  it('drops the junction table before the index table', async () => {
    const mocks = createQueryInterfaceMock();

    await down({ name: 'create-index-master', context: mocks.queryInterface });

    expect(mocks.dropTableCalls).toEqual(['index_constituents', 'indices']);
  });
});
