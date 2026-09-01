import type { Sequelize } from 'sequelize';

import { Company } from './company.model.js';
import { IndexConstituent, initializeIndexConstituentModel } from './index-constituent.model.js';
import { initializeMarketIndexModel, MarketIndex } from './market-index.model.js';

export function initializeIndexMasterModels(database: Sequelize): void {
  initializeMarketIndexModel(database);
  initializeIndexConstituentModel(database);

  MarketIndex.hasMany(IndexConstituent, {
    as: 'indexConstituents',
    foreignKey: 'indexId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
  Company.hasMany(IndexConstituent, {
    as: 'indexConstituents',
    foreignKey: 'companyId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
  IndexConstituent.belongsTo(MarketIndex, {
    as: 'index',
    foreignKey: 'indexId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
  IndexConstituent.belongsTo(Company, {
    as: 'company',
    foreignKey: 'companyId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
  Company.belongsToMany(MarketIndex, {
    as: 'indices',
    through: IndexConstituent,
    foreignKey: 'companyId',
    otherKey: 'indexId',
  });
  MarketIndex.belongsToMany(Company, {
    as: 'companies',
    through: IndexConstituent,
    foreignKey: 'indexId',
    otherKey: 'companyId',
  });
}

export { IndexConstituent, MarketIndex };
