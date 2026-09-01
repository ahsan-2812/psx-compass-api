import { DataTypes, Op, literal } from 'sequelize';

import type { Migration } from '../migrator.js';
import {
  listingStatuses,
  securityTypes,
  shariahStatuses,
  valuationEngines,
} from '../../modules/securities/security-master.constants.js';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'sectors',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        code: { type: DataTypes.STRING(50), allowNull: false },
        name: { type: DataTypes.STRING(200), allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );

    await queryInterface.addIndex('sectors', ['code'], {
      name: 'sectors_code_uq',
      unique: true,
      transaction,
    });
    await queryInterface.addIndex('sectors', ['name'], {
      name: 'sectors_name_uq',
      unique: true,
      transaction,
    });

    await queryInterface.createTable(
      'companies',
      {
        id: {
          type: 'UNIQUEIDENTIFIER',
          primaryKey: true,
          allowNull: false,
          defaultValue: literal('NEWSEQUENTIALID()'),
        },
        symbol: { type: DataTypes.STRING(20), allowNull: false },
        name: { type: DataTypes.STRING(200), allowNull: false },
        sector_id: { type: DataTypes.INTEGER, allowNull: false },
        security_type: { type: DataTypes.STRING(20), allowNull: false },
        listing_status: { type: DataTypes.STRING(20), allowNull: false },
        shariah_status: { type: DataTypes.STRING(20), allowNull: false },
        valuation_engine: { type: DataTypes.STRING(20), allowNull: false },
        listed_at: { type: DataTypes.DATEONLY, allowNull: true },
        delisted_at: { type: DataTypes.DATEONLY, allowNull: true },
        data_source: { type: DataTypes.STRING(200), allowNull: true },
        source_updated_at: { type: DataTypes.DATE, allowNull: true },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );

    await queryInterface.addConstraint('companies', {
      name: 'companies_sector_id_fk',
      fields: ['sector_id'],
      type: 'foreign key',
      references: { table: 'sectors', field: 'id' },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      transaction,
    });
    await queryInterface.addConstraint('companies', {
      name: 'companies_security_type_ck',
      fields: ['security_type'],
      type: 'check',
      where: { security_type: { [Op.in]: securityTypes } },
      transaction,
    });
    await queryInterface.addConstraint('companies', {
      name: 'companies_listing_status_ck',
      fields: ['listing_status'],
      type: 'check',
      where: { listing_status: { [Op.in]: listingStatuses } },
      transaction,
    });
    await queryInterface.addConstraint('companies', {
      name: 'companies_shariah_status_ck',
      fields: ['shariah_status'],
      type: 'check',
      where: { shariah_status: { [Op.in]: shariahStatuses } },
      transaction,
    });
    await queryInterface.addConstraint('companies', {
      name: 'companies_valuation_engine_ck',
      fields: ['valuation_engine'],
      type: 'check',
      where: { valuation_engine: { [Op.in]: valuationEngines } },
      transaction,
    });

    await queryInterface.addIndex('companies', ['symbol'], {
      name: 'companies_symbol_uq',
      unique: true,
      transaction,
    });
    for (const field of ['sector_id', 'listing_status', 'shariah_status', 'valuation_engine']) {
      await queryInterface.addIndex('companies', [field], {
        name: `companies_${field}_idx`,
        transaction,
      });
    }
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('companies', { transaction });
    await queryInterface.dropTable('sectors', { transaction });
  });
};
