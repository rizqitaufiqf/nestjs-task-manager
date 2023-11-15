export type AppConfigType = {
  nodeEnv: string;
  port: number;
  name: string;
  apiPrefix: string;
};

export type JwtAuthConfigType = {
  secret: string;
  expires: string;
  refreshSecret: string;
  refreshExpires: string;
};

export type DatabaseConfigType = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type RedisConfigType = {
  host: string;
  port: number;
};

export type AllConfigType = {
  app: AppConfigType;
  auth: JwtAuthConfigType;
  database: DatabaseConfigType;
  redis: RedisConfigType;
};
