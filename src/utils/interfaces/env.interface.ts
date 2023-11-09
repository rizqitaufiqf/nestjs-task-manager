export interface IEnvironmentVariables {
  NODE_ENV: string;
  APP_PORT: number;
  APP_NAME: string;
  API_PREFIX: string;

  DATABASE_TYPE: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_MAX_CONNECTIONS: number;
  DATABASE_SSL_ENABLED: boolean;
  DATABASE_REJECT_UNAUTHORIZED: boolean;
  DATABASE_URL: string;
  DATABASE_CA: string;
  DATABASE_KEY: string;
  DATABASE_CERT: string;

  AUTH_JWT_SECRET: string;
  AUTH_JWT_EXPIRES_IN: string;
  AUTH_JWT_REFRESH_SECRET: string;
  AUTH_JWT_REFRESH_EXPIRES_IN: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
}
