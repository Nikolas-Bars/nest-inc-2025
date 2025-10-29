import { BlogDocument } from '../../domain/blog.entity';

export class BlogExternalViewDto {
  id: string;
  name: string;

  static mapToView(blog: BlogDocument): BlogExternalViewDto {
    const dto = new BlogExternalViewDto();

    dto.name = blog.name;
    dto.id = blog._id.toString();

    return dto;
  }
}
