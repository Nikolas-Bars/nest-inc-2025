//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import { IsString, Length, Matches } from 'class-validator';

export class CreateBlogInputDto {
  @IsString({ message: 'name must be a string' })
  name: string;
  @IsString({ message: 'description must be a string' })
  description: string;
  @IsString({ message: 'websiteUrl must be a string' })
  @Length(5, 100, { message: 'websiteUrl must be between 5 and 100 characters' })
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, {
    message: 'websiteUrl must match the required pattern',
  })
  websiteUrl: string;
}
