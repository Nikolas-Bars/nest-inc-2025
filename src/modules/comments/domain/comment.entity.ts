import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { CommentatorInfoType } from './commentator-info-type';
import type { CommentLikesInfoType } from './likes-info-type';
import { LikeStatusCommentEnum } from './likes-info-type';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateCommentDto } from '../dto/create-comment.dto';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Object, required: true })
  commentatorInfo: CommentatorInfoType;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({
    type: Object,
    default: () => ({
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusCommentEnum.None,
    }),
  })
  likesInfo: CommentLikesInfoType;

  createdAt: Date;

  updatedAt: Date;

  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  static createInstance(dto: CreateCommentDomainDto) {
    const comment = new Comment();

    comment.content = dto.content;
    comment.commentatorInfo = dto.commentatorInfo;
    comment.likesInfo = dto.likesInfo;

    return comment as CommentDocument;
  }

  update(dto: UpdateCommentDto) {
    if (dto.content) {
      this.content = dto.content;
    }
    if (dto.likesInfo) {
      this.likesInfo = dto.likesInfo
    }
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
