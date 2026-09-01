import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import type { Company } from './company.model.js';
import type { MarketIndex } from './market-index.model.js';

export class IndexConstituent extends Model<
  InferAttributes<IndexConstituent>,
  InferCreationAttributes<IndexConstituent>
> {
  declare id: CreationOptional<number>;
  declare indexId: ForeignKey<MarketIndex['id']>;
  declare companyId: ForeignKey<Company['id']>;
  declare effectiveFrom: string;
  declare effectiveTo: string | null;
  declare weightPercentage: string | null;
  declare dataSource: string | null;
  declare sourceUpdatedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare index?: NonAttribute<MarketIndex>;
  declare company?: NonAttribute<Company>;
}

export function initializeIndexConstituentModel(database: Sequelize): typeof IndexConstituent {
  IndexConstituent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      indexId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'index_id',
      },
      companyId: {
        type: 'UNIQUEIDENTIFIER',
        allowNull: false,
        field: 'company_id',
      },
      effectiveFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'effective_from',
      },
      effectiveTo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'effective_to',
      },
      weightPercentage: {
        type: DataTypes.DECIMAL(7, 4),
        allowNull: true,
        field: 'weight_percentage',
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
      modelName: 'IndexConstituent',
      tableName: 'index_constituents',
      timestamps: true,
      underscored: true,
    },
  );

  return IndexConstituent;
}
