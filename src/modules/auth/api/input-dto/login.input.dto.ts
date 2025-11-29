import { IsString, Length } from 'class-validator';

export class LoginInputDto {
  @IsString({ message: 'loginOrEmail must be a string' })
  @Length(5, 16, { message: 'loginOrEmail must be between 6 and 16 characters' })
  loginOrEmail: string;

  @IsString({ message: 'password must be a string' })
  @Length(8, 20, { message: 'password must be between 8 and 20 characters' })
  password: string;
}
