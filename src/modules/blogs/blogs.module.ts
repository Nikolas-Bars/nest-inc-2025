import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { BlogsController } from './api/blogs.controller';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsExternalService } from './application/blogs-external.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsQueryRepository, BlogsRepository, BlogsService, BlogsExternalService],
  exports: [BlogsExternalService],
})
export class BlogsModule {}
