import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: `Username can't be empti` })
  readonly username: string;

  @IsNotEmpty({ message: `Email can't be empti` })
  @IsEmail({}, { message: `Incorrect email` })
  readonly email: string;

  @IsNotEmpty({ message: `Password can't be empti` })
  readonly password: string;
}
