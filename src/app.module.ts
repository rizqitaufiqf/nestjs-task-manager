import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
