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

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Transform(LowerCaseTransformer)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Use only letters(lowercase), numbers, and underscores (_) in your username',
  })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol.',
  })
  password: string;

  @IsOptional()
  @IsEmail()
  @Transform(LowerCaseTransformer)
  email: string;
}
