import { Router } from 'express';
import type { Sequelize } from 'sequelize';

export function createHealthRouter(database: Sequelize): Router {
  const router = Router();

  router.get('/live', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  router.get('/ready', async (_request, response) => {
    try {
      await database.authenticate();
      response.status(200).json({ status: 'ready', database: 'connected' });
    } catch {
      response.status(503).json({ status: 'unavailable', database: 'disconnected' });
    }
  });

  return router;
}
