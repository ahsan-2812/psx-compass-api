import { Sequelize } from 'sequelize';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from 'vitest';

import { Company } from '../../../src/modules/securities/company.model.js';
import {
  IndexConstituent,
  MarketIndex,
} from '../../../src/modules/securities/index-master.models.js';
import { indexTypes } from '../../../src/modules/securities/security-master.constants.js';
import { initializeSecurityMasterModels } from '../../../src/modules/securities/security-master.models.js';

describe('index master models', () => {
  let database: Sequelize;

  beforeEach(() => {
    database = new Sequelize('psx_compass_test', 'sa', 'test-password', {
      dialect: 'mssql',
      host: '127.0.0.1',
      logging: false,
    });
    initializeSecurityMasterModels(database);
  });

  afterEach(async () => {
    await database.close();
  });

  it('defines index and temporal constituent field mappings', () => {
    expect(MarketIndex.getTableName()).toBe('indices');
    expect(MarketIndex.rawAttributes.indexType?.field).toBe('index_type');
    expect(IndexConstituent.getTableName()).toBe('index_constituents');
    expect(IndexConstituent.rawAttributes.companyId?.type).toBe('UNIQUEIDENTIFIER');
    expect(IndexConstituent.rawAttributes.effectiveFrom?.field).toBe('effective_from');
    expect(IndexConstituent.rawAttributes.effectiveTo?.field).toBe('effective_to');
    expect(
      IndexConstituent.rawAttributes.weightPercentage?.type.toString({ escape: () => '' }),
    ).toBe('DECIMAL(7,4)');
  });

  it('uses strings for DATEONLY and decimal attributes', () => {
    expectTypeOf<IndexConstituent['effectiveFrom']>().toEqualTypeOf<string>();
    expectTypeOf<IndexConstituent['effectiveTo']>().toEqualTypeOf<string | null>();
    expectTypeOf<IndexConstituent['weightPercentage']>().toEqualTypeOf<string | null>();
  });

  it('defines direct and many-to-many associations', () => {
    expect(MarketIndex.associations.indexConstituents?.target).toBe(IndexConstituent);
    expect(Company.associations.indexConstituents?.target).toBe(IndexConstituent);
    expect(IndexConstituent.associations.index?.target).toBe(MarketIndex);
    expect(IndexConstituent.associations.company?.target).toBe(Company);
    expect(Company.associations.indices?.target).toBe(MarketIndex);
    expect(MarketIndex.associations.companies?.target).toBe(Company);
  });

  it('exposes supported index classifications', () => {
    expect(indexTypes).toEqual(['BROAD_MARKET', 'SECTOR', 'SHARIAH', 'DIVIDEND', 'OTHER']);
  });
});
