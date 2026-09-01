import { Sequelize } from 'sequelize';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from 'vitest';

import {
  Company,
  initializeSecurityMasterModels,
  Sector,
} from '../../../src/modules/securities/security-master.models.js';
import {
  listingStatuses,
  securityTypes,
  shariahStatuses,
  valuationEngines,
} from '../../../src/modules/securities/security-master.constants.js';

describe('security master models', () => {
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

  it('defines SQL Server-compatible table and field mappings', () => {
    expect(Sector.getTableName()).toBe('sectors');
    expect(Company.getTableName()).toBe('companies');
    expect(Company.rawAttributes.id?.type).toBe('UNIQUEIDENTIFIER');
    expect(Company.rawAttributes.symbol?.type.toString({ escape: () => '' })).toBe('NVARCHAR(20)');
    expect(Company.rawAttributes.name?.type.toString({ escape: () => '' })).toBe('NVARCHAR(200)');
    expect(Company.rawAttributes.sectorId?.field).toBe('sector_id');
    expect(Company.rawAttributes.sourceUpdatedAt?.field).toBe('source_updated_at');
    expect(Company.rawAttributes.listedAt?.type.toString({ escape: () => '' })).toBe('DATE');
    expect(Company.rawAttributes.delistedAt?.type.toString({ escape: () => '' })).toBe('DATE');
  });

  it('types DATEONLY attributes as nullable date strings', () => {
    expectTypeOf<Company['listedAt']>().toEqualTypeOf<string | null>();
    expectTypeOf<Company['delistedAt']>().toEqualTypeOf<string | null>();
  });

  it('defines both sides of the sector-company association', () => {
    expect(Sector.associations.companies?.target).toBe(Company);
    expect(Company.associations.sector?.target).toBe(Sector);
    expect(Company.associations.sector?.foreignKey).toBe('sectorId');
  });

  it('exposes the supported security classifications', () => {
    expect(securityTypes).toEqual(['EQUITY', 'REIT', 'ETF', 'OTHER']);
    expect(listingStatuses).toEqual(['ACTIVE', 'SUSPENDED', 'DELISTED']);
    expect(shariahStatuses).toEqual(['COMPLIANT', 'NON_COMPLIANT', 'UNKNOWN']);
    expect(valuationEngines).toEqual(['NORMAL', 'BANK', 'REIT']);
  });
});
