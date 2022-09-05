import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: `Email can't be empti` })
  @IsEmail({}, { message: `Incorrect email` })
  readonly email: string;

  @IsNotEmpty({ message: `Password can't be empti` })
  readonly password: string;
}
