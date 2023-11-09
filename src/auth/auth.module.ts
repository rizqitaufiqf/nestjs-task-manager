import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { PassportConfig } from '../config/passport.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigAsync } from '../config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtRefreshTokenStorage } from './storage/jwt-refresh-token.storage';

@Module({
  imports: [
    UsersModule,
    PassportModule.register(PassportConfig),
    JwtModule.registerAsync(JwtConfigAsync),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshTokenStorage,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, JwtRefreshTokenStrategy],
})
export class AuthModule {}
