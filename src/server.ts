import { createServer } from 'node:http';

import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { createLogger } from './config/logger.js';
import { createSequelize } from './database/sequelize.js';

async function startServer(): Promise<void> {
  const env = loadEnv();
  const logger = createLogger(env);
  const database = createSequelize(env, logger);

  await database.authenticate();
  logger.info('SQL Server connection established');

  const app = createApp({ env, logger, database });
  const server = createServer(app);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, apiPrefix: env.API_PREFIX }, 'API server started');
  });

  let shuttingDown = false;
  const shutdown = (signal: NodeJS.Signals): void => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info({ signal }, 'Graceful shutdown started');
    server.close(async (serverError) => {
      try {
        await database.close();
        if (serverError) throw serverError;
        logger.info('Graceful shutdown completed');
        process.exitCode = 0;
      } catch (error) {
        logger.error({ err: error }, 'Graceful shutdown failed');
        process.exitCode = 1;
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((error: unknown) => {
  // Logger construction depends on valid environment configuration.
  console.error('Failed to start PSX Compass API', error);
  process.exitCode = 1;
});
