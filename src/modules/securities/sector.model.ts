import { DataTypes, Model } from 'sequelize';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import type { Company } from './company.model.js';

export class Sector extends Model<InferAttributes<Sector>, InferCreationAttributes<Sector>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare name: string;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare companies?: NonAttribute<Company[]>;
}

export function initializeSectorModel(database: Sequelize): typeof Sector {
  Sector.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
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
      modelName: 'Sector',
      tableName: 'sectors',
      timestamps: true,
      underscored: true,
    },
  );

  return Sector;
}
