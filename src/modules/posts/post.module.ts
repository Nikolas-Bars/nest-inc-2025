import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/post.entity';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/query/posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsQueryExternalRepository } from './infrastructure/external-query/posts.query-external-repository';
import { PostsExternalService } from './application/posts.external-service';
import { LikePostModule } from '../like-posts/like-post.module';

@Module({
  imports: [
    forwardRef(() => BlogsModule),
    CommentsModule,
    LikePostModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    PostsQueryExternalRepository,
    PostsExternalService
  ],
  exports: [PostsQueryExternalRepository, PostsExternalService],
})
export class PostsModule {}
