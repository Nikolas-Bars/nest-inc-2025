import { Module } from '@nestjs/common';
import { LikePost, LikePostSchema } from './domain/like-post.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LikePostRepository } from './infrastructure/like-post.repository';
import { LikesPostExternalService } from './application/likes-post-external.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: LikePost.name, schema: LikePostSchema }]),
  ],
  controllers: [],
  providers: [
    LikePostRepository,
    LikesPostExternalService
  ],
  exports: [LikesPostExternalService],
})
export class LikePostModule {}
