import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { UpdateBlogDto } from '../dto/create-blog.dto';

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, min: 5, required: true })
  websiteUrl: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  //если используете по всей системе шв айди как string, можете юзать, если id
  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  //DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
  static createInstance(dto: CreateBlogDomainDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = false;

    return blog as BlogDocument;
  }

  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  makeDeleted() {
    console.log(this.deletedAt, 'this.deletedAt');
    if (this.deletedAt) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
  update(dto: UpdateBlogDto) {
    if(dto.name) {
      this.name = dto.name;
    }
    if(dto.description) {
      this.description = dto.description;
    }
    if(dto.websiteUrl) {
      this.websiteUrl = dto.websiteUrl;
    }
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует методы сущности в схеме
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//Типизация модели + статические методы
export type BlogModelType = Model<BlogDocument> & typeof Blog;
