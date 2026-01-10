//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import { IsString, Length, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../core/decorators/is-string-with-trim';

export class CreateBlogInputDto {
  @IsStringWithTrim(2, 15)
  name: string;
  @IsStringWithTrim(1, 500)
  description: string;
  @IsStringWithTrim(5, 100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: 'websiteUrl must match the required pattern',
  })
  websiteUrl: string;
}
