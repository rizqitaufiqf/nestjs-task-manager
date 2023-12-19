import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { TypeormConfigService } from '../database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import authConfig from './auth.config';
import redisConfig from './redis.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import rateLimitConfig from './rate-limit.config';
import { AllConfigType } from './config.type';
import ms from 'ms';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        redisConfig,
        rateLimitConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      dataSourceFactory: async (
        options: DataSourceOptions,
      ): Promise<DataSource> => {
        return new DataSource(options).initialize();
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        throttlers: [
          {
            name: 'short',
            ttl: parseInt(
              ms(
                configService.getOrThrow('ratelimit.short_ttl', {
                  infer: true,
                }),
              ),
            ),
            limit: configService.getOrThrow('ratelimit.short_limit', {
              infer: true,
            }),
          },
          {
            name: 'medium',
            ttl: parseInt(
              ms(
                configService.getOrThrow('ratelimit.medium_ttl', {
                  infer: true,
                }),
              ),
            ),
            limit: configService.getOrThrow('ratelimit.medium_limit', {
              infer: true,
            }),
          },
          {
            name: 'long',
            ttl: parseInt(
              ms(
                configService.getOrThrow('ratelimit.long_ttl', {
                  infer: true,
                }),
              ),
            ),
            limit: configService.getOrThrow('ratelimit.long_limit', {
              infer: true,
            }),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [NestConfigModule, TypeOrmModule, ThrottlerModule],
})
export class ConfigModule {}
