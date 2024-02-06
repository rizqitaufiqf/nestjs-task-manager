import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { PRISMA_CLIENT_OPTIONS } from '../config/prisma.config';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'error' | 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ ...PRISMA_CLIENT_OPTIONS });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('error', (error: Prisma.LogEvent) => {
      console.log(error);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
