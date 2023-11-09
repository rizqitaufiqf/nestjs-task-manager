import { ConfigModuleOptions } from '@nestjs/config';

export const EnvConfig: ConfigModuleOptions = {
  envFilePath: ['.env'],
  isGlobal: true,
};
