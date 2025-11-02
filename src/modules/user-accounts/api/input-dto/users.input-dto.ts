//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import { IsEmail, IsString, Length } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/is-string-with-trim';

export class CreateUserInputDto {
  @IsStringWithTrim(4, 10)
  login: string;

  @IsString()
  @Length(6, 10)
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}

