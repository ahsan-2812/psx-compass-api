import pino from 'pino';

import type { AppEnv } from './env.js';

export function createLogger(env: Pick<AppEnv, 'LOG_LEVEL' | 'NODE_ENV'>) {
  return pino({
    level: env.LOG_LEVEL,
    base: {
      service: 'psx-compass-api',
      environment: env.NODE_ENV,
    },
    redact: {
      paths: ['req.headers.authorization', 'password', '*.password', 'token', '*.token'],
      censor: '[REDACTED]',
    },
  });
}

export type AppLogger = ReturnType<typeof createLogger>;
