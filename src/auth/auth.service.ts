import { Injectable, UnauthorizedException } from '@nestjs/common';
import ms from 'ms';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { JwtRefreshTokenStorage } from './storage/jwt-refresh-token.storage';

import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { IJwtPayload } from '../utils/interfaces/jwt-payload.interface';
import { AllConfigType } from '../config/config.type';

import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenStorage: JwtRefreshTokenStorage,
    private configService: ConfigService<AllConfigType>,
    private prisma: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresToken: number;
    expiresRefreshToken: number;
  }> {
    const tokenExpiresIn: string = this.configService.getOrThrow(
      'auth.expires',
      {
        infer: true,
      },
    );
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const refreshTokenExpiresIn: string = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );
    const refreshTokenExpires = Date.now() + ms(refreshTokenExpiresIn);

    const user = await this.validateUser(signInDto);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
          auth_origin: user.auth_origin,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', {
            infer: true,
          }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        { id: user.id, username: user.username },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: refreshTokenExpiresIn,
        },
      ),
    ]);

    // Store refresh token in Redis
    await this.refreshTokenStorage.insert(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresToken: tokenExpires,
      expiresRefreshToken: refreshTokenExpires,
    };
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; expiresToken: number }> {
    const tokenExpiresIn: string = this.configService.getOrThrow(
      'auth.expires',
      {
        infer: true,
      },
    );
    const expiresToken = Date.now() + ms(tokenExpiresIn);

    try {
      const { refreshToken, accessToken: oldAccessToken } = refreshTokenDto;
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
      await this.refreshTokenStorage.validate(decoded.id, refreshToken);
      await this.refreshTokenStorage.insertBlacklist(
        decoded.id,
        oldAccessToken,
      );

      const payload: IJwtPayload = {
        id: decoded.id,
        username: decoded.username,
        auth_origin: 'refresh_token',
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('auth.secret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.expires', {
          infer: true,
        }),
      });

      return { accessToken, expiresToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signOut(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.getOrThrow('auth.secret', {
          infer: true,
        }),
      });

      await this.refreshTokenStorage.invalidate(decoded.id);
      await this.refreshTokenStorage.insertBlacklist(decoded.id, accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private async validateUser({
    username,
    password,
  }: SignInDto): Promise<IJwtPayload> {
    const user: User = await this.prisma.user.findUnique({
      where: { username },
    });

    if (user && (await this.validatePassword(user.password, password))) {
      return {
        id: user.id,
        username: user.username,
        auth_origin: 'user_credentials',
      };
    }

    return null;
  }

  private async validatePassword(
    originPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, originPassword);
  }
}
