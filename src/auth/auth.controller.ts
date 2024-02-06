import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

import { Public } from '../utils/decorators/functions/public.decorator';
import { GetAuthorization } from '../utils/decorators/params/get-authorization.decorator';

import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AllConfigType } from '../config/config.type';

import { ApiTags } from '@nestjs/swagger';
import { SignUpSwaggerDecorator } from './decorators/functions/swagger/sign-up.decorator';
import { SignInSwaggerDecorator } from './decorators/functions/swagger/sign-in.decorator';
import { RefreshTokenSwaggerDecorator } from './decorators/functions/swagger/refresh-token.decorator';
import { SignOutSwaggerDecorator } from './decorators/functions/swagger/sign-out.decorator';

import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @SignUpSwaggerDecorator()
  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() signUpDto: SignUpDto): Promise<Partial<User>> {
    return this.userService.createUser(signUpDto);
  }

  @SignInSwaggerDecorator()
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) response: Response,
  ) {
    // for testing only. you can set refresh token cookie in frontend
    const { accessToken, refreshToken, expiresToken, expiresRefreshToken } =
      await this.authService.signIn(signInDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(expiresToken),
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(expiresRefreshToken),
    });

    return { accessToken, refreshToken, expiresToken, expiresRefreshToken };
    // return { message: 'sign in successfully', status: 200 };
    // end of set refresh token cookie */

    // return await this.authService.signIn(signInDto);
  }

  @RefreshTokenSwaggerDecorator()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @GetAuthorization() authorization: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken({
      refreshToken: req.cookies.refreshToken ?? '',
      accessToken: authorization,
    });
  }

  @SignOutSwaggerDecorator()
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @GetAuthorization() authorization: string,
  ): Promise<{ message: string }> {
    await this.authService.signOut(authorization);
    return { message: 'logout successfully' };
  }
}
