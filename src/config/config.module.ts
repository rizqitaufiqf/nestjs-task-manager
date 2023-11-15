import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { TypeormConfigService } from '../database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import authConfig from './auth.config';
import redisConfig from './redis.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, authConfig, databaseConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      dataSourceFactory: async (
        options: DataSourceOptions,
      ): Promise<DataSource> => {
        return new DataSource(options).initialize();
      },
    }),
  ],
  exports: [NestConfigModule, TypeOrmModule],
})
export class ConfigModule {}
