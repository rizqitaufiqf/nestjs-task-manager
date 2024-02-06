import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../database/prisma.module';

import { TasksController } from './tasks.controller';

import { TasksService } from './tasks.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
