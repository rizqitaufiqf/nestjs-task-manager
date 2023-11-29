import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'user_name' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Username123!' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
