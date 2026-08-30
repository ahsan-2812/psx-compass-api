import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import {
  createDisconnectedTestDatabase,
  testEnv,
  testLogger,
} from './helpers/test-dependencies.js';

const database = createDisconnectedTestDatabase();
const app = createApp({ env: testEnv, logger: testLogger, database });

afterAll(async () => {
  await database.close();
});

describe('health routes', () => {
  it('reports that the process is alive', async () => {
    const response = await request(app).get('/api/v1/health/live');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('reports unavailable when SQL Server cannot be reached', async () => {
    const response = await request(app).get('/api/v1/health/ready');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'unavailable',
      database: 'disconnected',
    });
  });

  it('returns a structured error for unknown routes', async () => {
    const response = await request(app).get('/api/v1/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'No route exists for GET /api/v1/unknown.',
      },
    });
  });
});
