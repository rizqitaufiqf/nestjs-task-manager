import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenStorage } from './storage/jwt-refresh-token.storage';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJwtPayload } from '../utils/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
    private jwtService: JwtService,
    private refreshTokenStorage: JwtRefreshTokenStorage,
    private configService: ConfigService<AllConfigType>,
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

    const user = await this.authRepository.validateUser(signInDto);
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
}
