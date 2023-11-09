import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from '../utils/interfaces/env.interface';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService<IEnvironmentVariables>) => {
    return {
      type: 'postgres',
      host: configService.getOrThrow('DATABASE_HOST', { infer: true }),
      port: configService.getOrThrow('DATABASE_PORT', { infer: true }),
      username: configService.getOrThrow('DATABASE_USER', { infer: true }),
      password: configService.getOrThrow('DATABASE_PASSWORD', { infer: true }),
      database: configService.getOrThrow('DATABASE_NAME', { infer: true }),
      entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
      synchronize: configService.getOrThrow('DATABASE_SYNCHRONIZE', {
        infer: true,
      }),
    };
  },
};
