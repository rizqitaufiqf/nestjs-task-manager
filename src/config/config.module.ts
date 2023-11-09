import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvConfig } from './env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    NestConfigModule.forRoot(EnvConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
  ],
  exports: [NestConfigModule, TypeOrmModule],
})
export class ConfigModule {}
