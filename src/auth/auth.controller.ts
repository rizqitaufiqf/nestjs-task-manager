import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { Public } from '../utils/decorators/public.decorator';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from '../utils/interfaces/env.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private configService: ConfigService<IEnvironmentVariables>,
  ) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.userService.createUser(signUpDto);
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // return await this.authService.signIn(signInDto);
    const { accessToken, refreshToken, expiresToken } =
      await this.authService.signIn(signInDto);

    // for testing only. you can set refresh token in frontend
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(expiresToken),
    });

    return { accessToken, refreshToken, expiresToken };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken({
      refreshToken: req.cookies.refreshToken ?? '',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Headers('authorization') authorization: string,
  ): Promise<{ message: string }> {
    const token = authorization.split(' ')[1];
    await this.authService.signOut(token);
    return { message: 'logout successfully' };
  }
}
