import { DataTypes, Op, col } from 'sequelize';

import type { Migration } from '../migrator.js';

const indexTypes = ['BROAD_MARKET', 'SECTOR', 'SHARIAH', 'DIVIDEND', 'OTHER'] as const;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'indices',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        code: { type: DataTypes.STRING(30), allowNull: false },
        name: { type: DataTypes.STRING(200), allowNull: false },
        index_type: { type: DataTypes.STRING(20), allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        data_source: { type: DataTypes.STRING(200), allowNull: true },
        source_updated_at: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );

    await queryInterface.addConstraint('indices', {
      name: 'indices_index_type_ck',
      fields: ['index_type'],
      type: 'check',
      where: { index_type: { [Op.in]: indexTypes } },
      transaction,
    });
    await queryInterface.addIndex('indices', ['code'], {
      name: 'indices_code_uq',
      unique: true,
      transaction,
    });
    await queryInterface.addIndex('indices', ['name'], {
      name: 'indices_name_uq',
      unique: true,
      transaction,
    });
    await queryInterface.addIndex('indices', ['index_type'], {
      name: 'indices_index_type_idx',
      transaction,
    });
    await queryInterface.addIndex('indices', ['is_active'], {
      name: 'indices_is_active_idx',
      transaction,
    });

    await queryInterface.createTable(
      'index_constituents',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        index_id: { type: DataTypes.INTEGER, allowNull: false },
        company_id: { type: 'UNIQUEIDENTIFIER', allowNull: false },
        effective_from: { type: DataTypes.DATEONLY, allowNull: false },
        effective_to: { type: DataTypes.DATEONLY, allowNull: true },
        weight_percentage: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
        data_source: { type: DataTypes.STRING(200), allowNull: true },
        source_updated_at: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );

    await queryInterface.addConstraint('index_constituents', {
      name: 'index_constituents_index_id_fk',
      fields: ['index_id'],
      type: 'foreign key',
      references: { table: 'indices', field: 'id' },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      transaction,
    });
    await queryInterface.addConstraint('index_constituents', {
      name: 'index_constituents_company_id_fk',
      fields: ['company_id'],
      type: 'foreign key',
      references: { table: 'companies', field: 'id' },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      transaction,
    });
    await queryInterface.addConstraint('index_constituents', {
      name: 'index_constituents_effective_dates_ck',
      fields: ['effective_from', 'effective_to'],
      type: 'check',
      where: {
        [Op.or]: [{ effective_to: null }, { effective_to: { [Op.gte]: col('effective_from') } }],
      },
      transaction,
    });
    await queryInterface.addConstraint('index_constituents', {
      name: 'index_constituents_weight_percentage_ck',
      fields: ['weight_percentage'],
      type: 'check',
      where: {
        [Op.or]: [{ weight_percentage: null }, { weight_percentage: { [Op.between]: [0, 100] } }],
      },
      transaction,
    });

    await queryInterface.addIndex('index_constituents', ['index_id'], {
      name: 'index_constituents_index_id_idx',
      transaction,
    });
    await queryInterface.addIndex('index_constituents', ['company_id'], {
      name: 'index_constituents_company_id_idx',
      transaction,
    });
    await queryInterface.addIndex('index_constituents', ['effective_from', 'effective_to'], {
      name: 'index_constituents_effective_dates_idx',
      transaction,
    });
    await queryInterface.addIndex(
      'index_constituents',
      ['index_id', 'effective_to', 'company_id'],
      {
        name: 'index_constituents_current_lookup_idx',
        transaction,
      },
    );
    await queryInterface.addIndex(
      'index_constituents',
      ['index_id', 'company_id', 'effective_from', 'effective_to'],
      {
        name: 'index_constituents_period_uq',
        unique: true,
        transaction,
      },
    );
    await queryInterface.addIndex('index_constituents', ['index_id', 'company_id'], {
      name: 'index_constituents_current_uq',
      unique: true,
      where: { effective_to: null },
      transaction,
    });
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('index_constituents', { transaction });
    await queryInterface.dropTable('indices', { transaction });
  });
};
