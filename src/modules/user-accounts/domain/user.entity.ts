import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Name, NameSchema } from './name.schema';

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, min: 5, required: true })
  email: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: NameSchema })
  name: Name;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  //если ипсльзуете по всей системе шв айди как string, можете юзать, если id
  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  //DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.isEmailConfirmed = false; // пользователь ВСЕГДА должен после регистрации подтверждить свой Email

    user.name = {
      firstName: 'firstName xxx',
      lastName: 'lastName yyy',
    };

    return user as UserDocument;
  }

  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  makeDeleted() {
    if (this.deletedAt) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
      this.email = dto.email;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
