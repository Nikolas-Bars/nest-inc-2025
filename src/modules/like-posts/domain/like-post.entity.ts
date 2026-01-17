import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  LikePostDomainDto,
  UpdateLikePostDomainDto,
} from './dto/like-post.domain.dto';
import { LikePostStatusEnum } from './like-post-type';

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class LikePost {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, enum: LikePostStatusEnum, required: true })
  status: LikePostStatusEnum;

  @Prop({ type: String, required: true })
  userId: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  //если используете по всей системе id айди как string, можете юзать, если id
  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  //DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
  static createInstance(dto: LikePostDomainDto): LikePostDocument {
    const likePost = new this();
    likePost.postId = dto.postId;
    likePost.status = dto.status;
    likePost.userId = dto.userId;

    return likePost as LikePostDocument;
  }

  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  makeDeleted() {
    if (this.deletedAt) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
  update(dto: UpdateLikePostDomainDto) {
    if(dto.userId) {
      this.userId = dto.userId;
    }
    if(dto.postId) {
      this.postId = dto.postId;
    }
    this.status = dto.status;
  }
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);

//регистрирует методы сущности в схеме
LikePostSchema.loadClass(LikePost);

//Типизация документа
export type LikePostDocument = HydratedDocument<LikePost>;

//Типизация модели + статические методы
export type LikePostModelType = Model<LikePostDocument> & typeof LikePost;
