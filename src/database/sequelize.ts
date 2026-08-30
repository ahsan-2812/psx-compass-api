import { Sequelize } from 'sequelize';

import type { AppEnv } from '../config/env.js';
import type { AppLogger } from '../config/logger.js';

export function createSequelize(env: AppEnv, logger: AppLogger): Sequelize {
  return new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    dialect: 'mssql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    logging: (message) => logger.debug({ sql: message }, 'SQL query'),
    pool: {
      max: env.DB_POOL_MAX,
      min: env.DB_POOL_MIN,
      acquire: env.DB_POOL_ACQUIRE_MS,
      idle: env.DB_POOL_IDLE_MS,
    },
    dialectOptions: {
      options: {
        encrypt: env.DB_ENCRYPT,
        trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
        connectTimeout: env.DB_CONNECTION_TIMEOUT_MS,
        requestTimeout: env.DB_REQUEST_TIMEOUT_MS,
      },
    },
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },
  });
}
