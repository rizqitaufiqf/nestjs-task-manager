import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../../users/users.repository';
import { Request } from 'express';
import { NullableType } from '../../utils/types/nullable.type';
import { IJwtRefreshPayload } from '../../utils/interfaces/jwt-refresh-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('AUTH_JWT_REFRESH_SECRET', {
        infer: true,
      }),
    });
  }

  async validate(payload: IJwtRefreshPayload): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: payload.id });
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
