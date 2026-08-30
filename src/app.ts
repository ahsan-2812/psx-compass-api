import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import type { Sequelize } from 'sequelize';

import { createErrorHandler } from './common/middleware/error-handler.js';
import { notFoundHandler } from './common/middleware/not-found.js';
import type { AppEnv } from './config/env.js';
import type { AppLogger } from './config/logger.js';
import { createHealthRouter } from './modules/health/health.routes.js';

export interface AppDependencies {
  env: AppEnv;
  logger: AppLogger;
  database: Sequelize;
}

export function createApp({ env, logger, database }: AppDependencies): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(pinoHttp({ logger }));

  app.use(`${env.API_PREFIX}/health`, createHealthRouter(database));

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
