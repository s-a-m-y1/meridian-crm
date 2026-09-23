export type Env = 'development' | 'production' | 'test';

export interface AppConfig {
  nodeEnv: Env;
  port: number;
  cors: { origin: string | false };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  bcryptRounds: number;
  emailVerificationRequired: boolean;
  throttle: {
    ttlMs: number;
    limit: number;
    authTtlMs: number;
    authLimit: number;
  };
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateEnv(env: Record<string, unknown>): Record<string, unknown> {
  const nodeEnv = String(env.NODE_ENV ?? 'development');
  if (nodeEnv !== 'production') return env;

  const errors: string[] = [];
  const check = (name: string, condition: boolean, message: string) => {
    if (condition) errors.push(`${name}: ${message}`);
  };

  const jwtSecret = String(env.JWT_SECRET ?? '');
  const refreshSecret = String(env.REFRESH_SECRET ?? '');

  check('JWT_SECRET', jwtSecret.length < 32, 'must be at least 32 characters in production');
  check('REFRESH_SECRET', refreshSecret.length < 32, 'must be at least 32 characters in production');
  check('JWT_SECRET', jwtSecret.includes('change-me'), 'default value not allowed in production');
  check('REFRESH_SECRET', refreshSecret.includes('change-me'), 'default value not allowed in production');

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${errors.join('\n- ')}`);
  }
  return env;
}

export const configuration = (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV ?? 'development') as Env,
  port: Number(process.env.PORT ?? 4000),
  cors: {
    origin:
      process.env.CORS_ORIGIN === 'false'
        ? false
        : (process.env.CORS_ORIGIN ?? 'http://localhost:3000'),
  },
  database: {
    host: required('PGHOST'),
    port: Number(process.env.PGPORT ?? 5432),
    user: required('PGUSER'),
    password: required('PGPASSWORD'),
    name: required('PGDATABASE'),
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? undefined,
    db: Number(process.env.REDIS_DB ?? 0),
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '900s',
    refreshSecret: required('REFRESH_SECRET'),
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN ?? '30d',
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
  emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
  throttle: {
    ttlMs: Number(process.env.THROTTLE_TTL ?? 60000),
    limit: Number(process.env.THROTTLE_LIMIT ?? 300),
    authTtlMs: Number(process.env.THROTTLE_AUTH_TTL ?? 60000),
    authLimit: Number(process.env.THROTTLE_AUTH_LIMIT ?? 10),
  },
});