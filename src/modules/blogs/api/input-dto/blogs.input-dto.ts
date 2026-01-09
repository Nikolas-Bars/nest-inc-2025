//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import { IsString, Matches } from 'class-validator';

export class CreateBlogInputDto {
  @IsString({ message: 'name must be a string' })
  name: string;
  @IsString({ message: 'description must be a string' })
  description: string;
  @IsString({ message: 'websiteUrl must be a string' })
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: 'websiteUrl must match the required pattern',
  })
  websiteUrl: string;
}
