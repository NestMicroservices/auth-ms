import { IsString } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @IsString()
  name: string;
}
