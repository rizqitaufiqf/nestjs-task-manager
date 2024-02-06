import { IsBoolean } from 'class-validator';
import { PrismaConfigType } from './config.type';
import validateConfig from '../utils/validate-config';
import { registerAs } from '@nestjs/config';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @IsBoolean()
  PRISMA_EVENT_QUERY: boolean;

  @IsBoolean()
  PRISMA_STDOUT_INFO: boolean;

  @IsBoolean()
  PRISMA_STDOUT_WARN: boolean;

  @IsBoolean()
  PRISMA_STDOUT_ERROR: boolean;
}

export default registerAs<PrismaConfigType>('prisma', (): PrismaConfigType => {
  const env: NodeJS.ProcessEnv = process.env;
  console.log(env);
  validateConfig(env, EnvironmentVariablesValidator);

  return {
    prisma_event_query: env.PRISMA_EVENT_QUERY !== 'false',
    prisma_stdout_info: env.PRISMA_STDOUT_INFO === 'true',
    prisma_stdout_warn: env.PRISMA_STDOUT_WARN === 'true',
    prisma_stdout_error: env.PRISMA_STDOUT_ERROR !== 'false',
  };
});
