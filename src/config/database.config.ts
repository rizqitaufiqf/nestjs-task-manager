import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { registerAs } from '@nestjs/config';
import { DatabaseConfigType } from './config.type';
import * as process from 'process';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  @IsOptional()
  DATABASE_PASSWORD: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export default registerAs<DatabaseConfigType>(
  'database',
  (): DatabaseConfigType => {
    const env: NodeJS.ProcessEnv = process.env;
    validateConfig(env, EnvironmentVariablesValidator);

    return {
      url: env.DATABASE_URL,
      type: env.DATABASE_TYPE,
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT ? parseInt(env.DATABASE_PORT, 10) : 5432,
      name: env.DATABASE_NAME,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      synchronize: env.DATABASE_SYNCHRONIZE === 'true',
      maxConnections: env.DATABASE_MAX_CONNECTIONS
        ? parseInt(env.DATABASE_MAX_CONNECTIONS)
        : 100,
      sslEnabled: env.DATABASE_SSL_ENABLED === 'true',
      rejectUnauthorized: env.DATABASE_REJECT_UNAUTHORIZED === 'true',
      ca: env.DATABASE_CA,
      key: env.DATABASE_KEY,
      cert: env.DATABASE_CERT,
    };
  },
);
