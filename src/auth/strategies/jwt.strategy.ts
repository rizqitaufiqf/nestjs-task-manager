import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { IJwtPayload } from '../../utils/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { JwtRefreshTokenStorage } from '../storage/jwt-refresh-token.storage';
import { IEnvironmentVariables } from '../../utils/interfaces/env.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    private configService: ConfigService<IEnvironmentVariables>,
    private refreshTokenStorage: JwtRefreshTokenStorage,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('AUTH_JWT_SECRET', { infer: true }),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const { username, sub } = payload;
    const accessToken = req.headers['authorization'].split(' ')[1] ?? '';

    // is token in blacklist token?
    const isNotValidToken = await this.refreshTokenStorage.validateBlacklist(
      sub,
      accessToken,
    );
    const user = await this.userRepository.findOneBy({ username });

    if (!user || isNotValidToken) {
      throw new UnauthorizedException('Invalid access token');
    }
    return user;
  }
}
