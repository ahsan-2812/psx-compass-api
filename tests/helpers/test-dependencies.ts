import { Sequelize } from 'sequelize';

import type { AppEnv } from '../../src/config/env.js';
import { createLogger } from '../../src/config/logger.js';

export const testEnv: AppEnv = {
  NODE_ENV: 'test',
  PORT: 3000,
  LOG_LEVEL: 'silent',
  API_PREFIX: '/api/v1',
  DB_HOST: 'localhost',
  DB_PORT: 1433,
  DB_NAME: 'psx_compass_test',
  DB_USER: 'sa',
  DB_PASSWORD: 'test-password',
  DB_ENCRYPT: false,
  DB_TRUST_SERVER_CERTIFICATE: true,
  DB_CONNECTION_TIMEOUT_MS: 1000,
  DB_REQUEST_TIMEOUT_MS: 1000,
  DB_POOL_MAX: 1,
  DB_POOL_MIN: 0,
  DB_POOL_ACQUIRE_MS: 1000,
  DB_POOL_IDLE_MS: 1000,
};

export const testLogger = createLogger(testEnv);

export function createDisconnectedTestDatabase(): Sequelize {
  return new Sequelize('psx_compass_test', 'sa', 'test-password', {
    dialect: 'mssql',
    host: '127.0.0.1',
    port: 1,
    logging: false,
    dialectOptions: { options: { connectTimeout: 50 } },
  });
}
