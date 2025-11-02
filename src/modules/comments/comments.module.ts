import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './api/comments.controller';
import { CommentsQueryRepository } from './infrastructure/query/comments.query-repository';
import { Comment, CommentSchema } from './domain/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsQueryRepository],
  exports: [CommentsQueryRepository],
})
export class CommentsModule {}
