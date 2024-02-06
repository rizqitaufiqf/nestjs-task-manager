import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

type LogLevel = 'info' | 'warn' | 'error' | 'query';
type LogOption = {
  level: LogLevel;
  emit: 'stdout' | 'event';
};

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'error' | 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private prismaConfig: ConfigService<AllConfigType>) {
    const logOptions: LogOption[] = [];
    if (prismaConfig.get('prisma.prisma_event_query', { infer: true })) {
      logOptions.push({
        emit: 'event',
        level: 'query',
      });
    }
    if (
      prismaConfig.getOrThrow('prisma.prisma_stdout_error', { infer: true })
    ) {
      logOptions.push({
        emit: 'stdout',
        level: 'error',
      });
    }
    if (prismaConfig.getOrThrow('prisma.prisma_stdout_info', { infer: true })) {
      logOptions.push({
        emit: 'stdout',
        level: 'info',
      });
    }
    if (prismaConfig.getOrThrow('prisma.prisma_stdout_warn', { infer: true })) {
      logOptions.push({
        emit: 'stdout',
        level: 'warn',
      });
    }

    console.log(logOptions);

    super({ ...{ log: logOptions } });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('query', (e: Prisma.QueryEvent) => {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    });

    // this.$on('error', (e) => {
    //   console.log(e);
    // });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
