import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { NullableType } from '../../utils/types/nullable.type';
import { IJwtRefreshPayload } from '../../utils/interfaces/jwt-refresh-payload.interface';
import { AllConfigType } from '../../config/config.type';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  async validate(payload: IJwtRefreshPayload): Promise<User> {
    const { username, id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id, username } });
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    return user;
  }
}

// this code for extract refresh token from cookie, place in jwtFromRequest
const cookieExtractor = (req: Request): NullableType<string> => {
  let refreshToken = null;
  if (req && req.cookies) {
    refreshToken = req.cookies.refreshToken;
  }
  return refreshToken;
};
