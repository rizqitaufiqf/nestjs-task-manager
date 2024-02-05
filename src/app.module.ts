import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
