import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from '../utils/interfaces/env.interface';

// https://www.youtube.com/watch?v=GVGeTshQ7iU
export const JwtConfigAsync: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService<IEnvironmentVariables>) => {
    return {
      secret: configService.getOrThrow('AUTH_JWT_SECRET', { infer: true }),
      signOptions: {
        expiresIn: configService.getOrThrow('AUTH_JWT_EXPIRES_IN', {
          infer: true,
        }),
      },
    };
  },
};
