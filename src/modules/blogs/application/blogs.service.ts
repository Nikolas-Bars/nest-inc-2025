import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private usersRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    //TODO: move to bcrypt service

    const blog = this.BlogModel.createInstance({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.usersRepository.save(blog);

    return blog._id.toString();
  }
  // async updateUser(id: string, dto: UpdateUserDto): Promise<string> {
  //   const user = await this.usersRepository.findOrNotFoundFail(id);
  //
  //   // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
  //   // создаём метод
  //   user.update(dto); // change detection
  //
  //   await this.usersRepository.save(user);
  //
  //   return user._id.toString();
  // }
  //
  // async deleteUser(id: string) {
  //   const user = await this.usersRepository.findOrNotFoundFail(id);
  //
  //   user.makeDeleted();
  //
  //   await this.usersRepository.save(user);
  // }
}
