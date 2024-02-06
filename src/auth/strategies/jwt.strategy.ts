import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../utils/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { JwtRefreshTokenStorage } from '../storage/jwt-refresh-token.storage';
import { AllConfigType } from '../../config/config.type';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService<AllConfigType>,
    private refreshTokenStorage: JwtRefreshTokenStorage,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<User> {
    const { username, id } = payload;
    const accessToken: string =
      req.headers['authorization'].split(' ')[1] ?? '';

    // is token in blacklist token?
    const isNotValidToken: boolean =
      await this.refreshTokenStorage.validateBlacklist(accessToken);
    const user = await this.prisma.user.findUnique({ where: { id, username } });

    if (!user || isNotValidToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }
}
