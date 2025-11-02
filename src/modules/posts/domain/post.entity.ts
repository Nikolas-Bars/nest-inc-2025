import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';
import { UpdatePostDto } from '../dto/create-update-post.dto';
import { LikeStatusEnum, NewestLikesType } from './extended-likes-type';
import type { ExtendedLikesInfoType } from './extended-likes-type';
//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date;
  // Стрелочная функция создаёт новый объект для каждого документа, чтобы избежать проблем с мутациями
  @Prop({ type: Object, default: () => ({
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatusEnum.None,
    newestLikes: []
  })})
  extendedLikesInfo: ExtendedLikesInfoType;

  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  //DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
  static createInstance(dto: CreatePostDomainDto) {
    const post = new this();

    post.title = dto.title;
    post.blogId = dto.blogId;
    post.content = dto.content;
    post.shortDescription = dto.shortDescription;
    post.blogName = dto.blogName;

    return post as PostDocument;
  }

  makeDeleted() {
    if (this.deletedAt) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  update(dto: UpdatePostDto) {
    if (dto.title) {
      this.title = dto.title;
    }
    if (dto.shortDescription) {
      this.shortDescription = dto.shortDescription;
    }
    if (dto.content) {
      this.content = dto.content;
    }
    if (dto.blogId) {
      this.blogId = dto.blogId;
    }
    if (dto.blogName) {
      this.blogName = dto.blogName;
    }
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

//регистрирует методы сущности в схеме
PostSchema.loadClass(Post);

//Типизация документа
export type PostDocument = HydratedDocument<Post>;

//Типизация модели + статические методы
export type PostModelType = Model<PostDocument> & typeof Post;
