import { IsInt, IsString, Max, Min } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { RedisConfigType } from './config.type';
import * as process from 'process';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsString()
  REDIS_USERNAME: string;

  @IsString()
  REDIS_PASSWORD: string;
}

export default registerAs('redis', (): RedisConfigType => {
  const env: NodeJS.ProcessEnv = process.env;
  validateConfig(env, EnvironmentVariablesValidator);

  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT ? parseInt(env.REDIS_PORT, 10) : 6379,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  };
});
