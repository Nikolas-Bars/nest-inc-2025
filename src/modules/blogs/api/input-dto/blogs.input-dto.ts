//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
import { IsString, isString } from 'class-validator';

export class CreateBlogInputDto {
  @IsString({ message: 'name must be a string' })
  name: string;
  @IsString({ message: 'description must be a string' })
  description: string;
  @IsString({ message: 'websiteUrl must be a string' })
  websiteUrl: string;
}
