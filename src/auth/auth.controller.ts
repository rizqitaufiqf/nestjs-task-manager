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
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { Public } from '../utils/decorators/functions/public.decorator';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { GetAuthorization } from '../utils/decorators/params/get-authorization.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SignUpSwaggerDecorator } from './decorators/functions/swagger/sign-up.decorator';
import { SignInSwaggerDecorator } from './decorators/functions/swagger/sign-in.decorator';
import { RefreshTokenSwaggerDecorator } from './decorators/functions/swagger/refresh-token.decorator';
import { SignOutSwaggerDecorator } from './decorators/functions/swagger/sign-out.decorator';

@ApiTags('Auth')
@Controller('auth')
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
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.userService.createUser(signUpDto);
  }

  @SignInSwaggerDecorator()
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, expiresToken, expiresRefreshToken } =
      await this.authService.signIn(signInDto);

    /* for testing only. you can set refresh token cookie in frontend
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(expiresRefreshToken),
    });
    end of set refresh token cookie */

    return { accessToken, refreshToken, expiresToken };
  }

  @RefreshTokenSwaggerDecorator()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken({
      refreshToken: req.cookies.refreshToken ?? '',
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
