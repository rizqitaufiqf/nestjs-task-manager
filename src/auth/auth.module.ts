import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtRefreshTokenStorage } from './storage/jwt-refresh-token.storage';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({}),
    PrismaModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshTokenStorage,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, JwtRefreshTokenStrategy],
})
export class AuthModule {}
