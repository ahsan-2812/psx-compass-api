import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import type {
  ListingStatus,
  SecurityType,
  ShariahStatus,
  ValuationEngine,
} from './security-master.constants.js';
import type { Sector } from './sector.model.js';

export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
  declare id: CreationOptional<string>;
  declare symbol: string;
  declare name: string;
  declare sectorId: ForeignKey<Sector['id']>;
  declare securityType: SecurityType;
  declare listingStatus: ListingStatus;
  declare shariahStatus: ShariahStatus;
  declare valuationEngine: ValuationEngine;
  declare listedAt: Date | null;
  declare delistedAt: Date | null;
  declare dataSource: string | null;
  declare sourceUpdatedAt: Date | null;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare sector?: NonAttribute<Sector>;
}

export function initializeCompanyModel(database: Sequelize): typeof Company {
  Company.init(
    {
      id: {
        type: 'UNIQUEIDENTIFIER',
        primaryKey: true,
      },
      symbol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      sectorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sector_id',
      },
      securityType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'security_type',
      },
      listingStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'listing_status',
      },
      shariahStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'shariah_status',
      },
      valuationEngine: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'valuation_engine',
      },
      listedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'listed_at',
      },
      delistedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'delisted_at',
      },
      dataSource: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'data_source',
      },
      sourceUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'source_updated_at',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize: database,
      modelName: 'Company',
      tableName: 'companies',
      timestamps: true,
      underscored: true,
    },
  );

  return Company;
}
