import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenStorage } from './storage/jwt-refresh-token.storage';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJwtPayload } from '../utils/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { IEnvironmentVariables } from '../utils/interfaces/env.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
    private jwtService: JwtService,
    private refreshTokenStorage: JwtRefreshTokenStorage,
    private configService: ConfigService<IEnvironmentVariables>,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresToken: number;
  }> {
    const tokenExpiresIn: string = this.configService.getOrThrow(
      'AUTH_JWT_EXPIRES_IN',
      {
        infer: true,
      },
    );
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const user = await this.authRepository.validateUser(signInDto);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const accessToken = await this.jwtService.signAsync(user);
    const refreshToken = await this.jwtService.signAsync(
      { id: user.sub, username: user.username },
      {
        secret: this.configService.getOrThrow('AUTH_JWT_REFRESH_SECRET', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow(
          'AUTH_JWT_REFRESH_EXPIRES_IN',
          {
            infer: true,
          },
        ),
      },
    );

    // Store refresh token in Redis
    await this.refreshTokenStorage.insert(user.sub, refreshToken);

    return { accessToken, refreshToken, expiresToken: tokenExpires };
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; tokenExpires: number }> {
    const tokenExpiresIn: string = this.configService.getOrThrow(
      'AUTH_JWT_EXPIRES_IN',
      {
        infer: true,
      },
    );
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    try {
      const { refreshToken } = refreshTokenDto;
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow('AUTH_JWT_REFRESH_SECRET', {
          infer: true,
        }),
      });
      await this.refreshTokenStorage.validate(decoded.id, refreshToken);

      const payload: IJwtPayload = {
        sub: decoded.id,
        username: decoded.username,
        auth_origin: 'refresh_token',
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken, tokenExpires };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signOut(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      await this.refreshTokenStorage.invalidate(decoded.sub);
      await this.refreshTokenStorage.insertBlacklist(decoded.sub, accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
