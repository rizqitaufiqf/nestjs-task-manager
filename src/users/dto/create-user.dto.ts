import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user_name',
    description:
      'only letters(lowercase), numbers, and underscores (_) are allowed in your username',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'Use only letters(lowercase), numbers, and underscores (_) in your username',
  })
  username: string;

  @ApiProperty({
    example: 'Username123!',
    description:
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol.',
  })
  password: string;

  @ApiProperty({
    example: 'username@mail.com',
    description: 'Valid email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @Transform(LowerCaseTransformer)
  email: string;
}
