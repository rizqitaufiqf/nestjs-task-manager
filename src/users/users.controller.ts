import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../utils/decorators/params/get-current-user.decorator';
import { UsersService } from './users.service';
import { MeSwaggerDecorator } from './decorators/functions/swagger/me.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MeSwaggerDecorator()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@GetCurrentUser() user: User): Promise<User> {
    return user;
  }
}
