import type { Sequelize } from 'sequelize';

import { Company, initializeCompanyModel } from './company.model.js';
import { Sector, initializeSectorModel } from './sector.model.js';

export function initializeSecurityMasterModels(database: Sequelize): void {
  initializeSectorModel(database);
  initializeCompanyModel(database);

  Sector.hasMany(Company, {
    as: 'companies',
    foreignKey: 'sectorId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
  Company.belongsTo(Sector, {
    as: 'sector',
    foreignKey: 'sectorId',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });
}

export { Company, Sector };
