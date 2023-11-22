import { DataSource, DataSourceOptions } from 'typeorm';
import * as process from 'process';
import { config } from 'dotenv';

config();
const env: NodeJS.ProcessEnv = process.env;

export const AppDataSource: DataSource = new DataSource({
  type: env.DATABASE_TYPE,
  url: env.DATABASE_URL,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT ? parseInt(env.DATABASE_PORT, 10) : 5432,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  logging: env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/**.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
  },
  extra: {
    max: env.DATABASE_MAX_CONNECTIONS
      ? parseInt(env.DATABASE_MAX_CONNECTIONS)
      : 100,
    ssl:
      env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized: env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: env.DATABASE_CA ?? undefined,
            key: env.DATABASE_KEY ?? undefined,
            cert: env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  },
} as DataSourceOptions);
