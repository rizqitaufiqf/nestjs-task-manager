import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { AllConfigType } from '../../config/config.type';

export class InvalidateRefreshTokenError extends Error {}

export class InvalidateTokenError extends Error {}

@Injectable()
export class JwtRefreshTokenStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  constructor(private configService: ConfigService<AllConfigType>) {}

  onApplicationBootstrap(): any {
    this.redisClient = new Redis({
      host: this.configService.getOrThrow('redis.host', { infer: true }),
      port: this.configService.getOrThrow('redis.port', { infer: true }),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onApplicationShutdown(signal?: string): Promise<'OK'> {
    return this.redisClient.quit();
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    const refreshTokenExpiresIn = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    await this.redisClient.set(this.getKey(userId), tokenId);
    await this.redisClient.expire(
      this.getKey(userId),
      (ms(refreshTokenExpiresIn) / 1000) as number,
    );
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedUser = await this.redisClient.get(this.getKey(userId));
    if (storedUser !== tokenId) throw new InvalidateRefreshTokenError();
    return storedUser === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  async insertBlacklist(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(
      this.getKeyBlacklist(tokenId),
      this.getKey(userId),
    );
    const seconds: string = ms(
      this.configService.getOrThrow('auth.expires', { infer: true }),
    );
    await this.redisClient.expire(
      this.getKeyBlacklist(tokenId),
      Number(seconds) / 1000,
    );
  }

  async validateBlacklist(tokenId: string): Promise<boolean> {
    const storedUser = await this.redisClient.get(
      this.getKeyBlacklist(tokenId),
    );

    return !!storedUser;
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }

  private getKeyBlacklist(userId: string): string {
    return `blacklist-${userId}`;
  }
}
