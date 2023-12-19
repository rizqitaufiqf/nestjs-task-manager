import { IsInt, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { RatelimitConfigType } from './config.type';
import process from 'process';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  RATELIMIT_SHORT_TTL: string;

  @IsInt()
  RATELIMIT_SHORT_LIMIT: number;

  @IsString()
  RATELIMIT_MEDIUM_TTL: string;

  @IsInt()
  RATELIMIT_MEDIUM_LIMIT: number;

  @IsString()
  RATELIMIT_LONG_TTL: string;

  @IsInt()
  RATELIMIT_LONG_LIMIT: number;
}

export default registerAs<RatelimitConfigType>(
  'ratelimit',
  (): RatelimitConfigType => {
    const env: NodeJS.ProcessEnv = process.env;
    validateConfig(env, EnvironmentVariablesValidator);

    return {
      short_ttl: env.RATELIMIT_SHORT_TTL || '2s',
      short_limit: env.RATELIMIT_SHORT_LIMIT
        ? parseInt(env.RATELIMIT_SHORT_LIMIT)
        : 5,
      medium_ttl: env.RATELIMIT_MEDIUM_TTL || '20s',
      medium_limit: env.RATELIMIT_MEDIUM_LIMIT
        ? parseInt(env.RATELIMIT_MEDIUM_LIMIT)
        : 30,
      long_ttl: env.RATELIMIT_LONG_TTL || '80s',
      long_limit: env.RATELIMIT_LONG_LIMIT
        ? parseInt(env.RATELIMIT_LONG_LIMIT)
        : 200,
    };
  },
);
