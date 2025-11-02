import { Get, Injectable, Param } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDocument } from '../domain/blog.entity';
import { BlogExternalViewDto } from '../api/view-dto/blogs-external-dto';

@Injectable()
export class BlogsExternalService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async getBlogById(id: string): Promise<BlogExternalViewDto | null> {
    const res = await this.blogsRepository.findById(id);

    if (!res) {
      return null;
    }

    return BlogExternalViewDto.mapToView(res)
  }
}
