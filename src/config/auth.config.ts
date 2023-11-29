import { IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { JwtAuthConfigType } from './config.type';
import validateConfig from '../utils/validate-config';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_EXPIRES_IN: string;

  @IsString()
  AUTH_JWT_REFRESH_SECRET: string;

  @IsString()
  AUTH_JWT_REFRESH_EXPIRES_IN: string;
}

export default registerAs<JwtAuthConfigType>('auth', (): JwtAuthConfigType => {
  const env: NodeJS.ProcessEnv = process.env;
  validateConfig(env, EnvironmentVariablesValidator);

  return {
    secret: env.AUTH_JWT_SECRET,
    expires: env.AUTH_JWT_EXPIRES_IN,
    refreshSecret: env.AUTH_JWT_REFRESH_SECRET,
    refreshExpires: env.AUTH_JWT_REFRESH_EXPIRES_IN,
  };
});
