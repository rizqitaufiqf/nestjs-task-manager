import { IsEqualTo } from '../../utils/decorators/functions/is-equal-to.decorator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends CreateUserDto {
  @ApiProperty({
    example: 'Username123!',
    description: 'confirmPassword must match with password exactly',
  })
  @IsEqualTo('password')
  confirmPassword: string;
}
