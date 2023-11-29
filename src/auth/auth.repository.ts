import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from '../utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async validateUser({ username, password }: SignInDto): Promise<IJwtPayload> {
    const user: User = await this.findOneBy({ username });

    if (user && (await user.validatePassword(password))) {
      return {
        id: user.id,
        username: user.username,
        auth_origin: 'user_credentials',
      };
    }

    return null;
  }
}
