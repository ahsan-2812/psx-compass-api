import 'dotenv/config';
import { z } from 'zod';

const booleanFromString = (defaultValue: boolean) =>
  z
    .enum(['true', 'false'])
    .default(defaultValue ? 'true' : 'false')
    .transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  API_PREFIX: z.string().startsWith('/').default('/api/v1'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().max(65_535).default(1433),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_ENCRYPT: booleanFromString(false),
  DB_TRUST_SERVER_CERTIFICATE: booleanFromString(true),
  DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  DB_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  DB_POOL_MIN: z.coerce.number().int().nonnegative().default(0),
  DB_POOL_ACQUIRE_MS: z.coerce.number().int().positive().default(30_000),
  DB_POOL_IDLE_MS: z.coerce.number().int().positive().default(10_000),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
}
