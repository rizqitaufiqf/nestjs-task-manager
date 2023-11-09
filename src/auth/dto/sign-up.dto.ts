import { IsEqualTo } from '../../utils/decorators/is-equal-to.decorator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @IsEqualTo('password')
  confirmPassword: string;
}
