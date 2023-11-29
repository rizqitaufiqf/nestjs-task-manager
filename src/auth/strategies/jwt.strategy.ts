import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { IJwtPayload } from '../../utils/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { JwtRefreshTokenStorage } from '../storage/jwt-refresh-token.storage';
import { AllConfigType } from '../../config/config.type';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
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

  async validate(req: Request, payload: IJwtPayload) {
    const { username, id } = payload;
    const accessToken: string =
      req.headers['authorization'].split(' ')[1] ?? '';

    // is token in blacklist token?
    const isNotValidToken: boolean =
      await this.refreshTokenStorage.validateBlacklist(accessToken);
    const user: User = await this.userRepository.findOneBy({ username, id });

    if (!user || isNotValidToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }
}
