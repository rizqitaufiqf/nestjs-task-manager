import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { username, password } = createUserDto;

    const salt: string = await bcrypt.genSalt(11);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    try {
      return await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          salt,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
