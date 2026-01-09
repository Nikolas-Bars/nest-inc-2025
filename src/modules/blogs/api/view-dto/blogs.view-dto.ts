import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  websiteUrl: string;
  isMembership: boolean;

  static mapToView(blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();

    dto.name = blog.name;
    dto.description = blog.description;
    dto.id = blog._id.toString();
    dto.createdAt = blog.createdAt;
    dto.websiteUrl = blog.websiteUrl;
    dto.isMembership = blog.isMembership

    return dto;
  }
}
