import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import type { Company } from './company.model.js';
import type { IndexConstituent } from './index-constituent.model.js';
import type { IndexType } from './security-master.constants.js';

export class MarketIndex extends Model<
  InferAttributes<MarketIndex>,
  InferCreationAttributes<MarketIndex>
> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare name: string;
  declare indexType: IndexType;
  declare isActive: CreationOptional<boolean>;
  declare dataSource: string | null;
  declare sourceUpdatedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare indexConstituents?: NonAttribute<IndexConstituent[]>;
  declare companies?: NonAttribute<Company[]>;
}

export function initializeMarketIndexModel(database: Sequelize): typeof MarketIndex {
  MarketIndex.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      },
      indexType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'index_type',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
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
      modelName: 'MarketIndex',
      tableName: 'indices',
      timestamps: true,
      underscored: true,
    },
  );

  return MarketIndex;
}
