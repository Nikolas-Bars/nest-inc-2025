import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Name, NameSchema } from './name.schema';
import type { EmailConfirmationType } from '../types/email-confirmation.type';
import { BadRequestException } from '@nestjs/common';

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

  @Prop({ type: String, nullable: true, default: null })
  salt: string;

  // Стрелочная функция создаёт новый объект для каждого документа, чтобы избежать проблем с мутациями
  @Prop({ type: Object, nullable: true, default: () => ({
      confirmationCode: null,
      expirationDate: null,
      isConfirmed: false,
    })})

  emailConfirmation: EmailConfirmationType;

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
    user.isEmailConfirmed = false; // пользователь ВСЕГДА должен после регистрации подтвердить свой Email
    user.emailConfirmation = dto.emailConfirmation || {
      confirmationCode: null,
      // expirationDate - дата когда код устареет
      expirationDate: null,
      isConfirmed: false
    }

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
  setConfirmationCode(code: string, exp?: Date) {
    // Создаём новый объект вместо мутации существующего
    // Это необходимо для того, чтобы Mongoose отследил изменение вложенного объекта
    this.emailConfirmation = {
      confirmationCode: code,
      expirationDate: exp || this.emailConfirmation?.expirationDate || null,
      isConfirmed: this.emailConfirmation?.isConfirmed || false,
    };
  }
  //DDD сontinue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
      this.email = dto.email;
    }
  }
  confirmEmail() {
    console.log(111);
    if (this.emailConfirmation?.isConfirmed) {
      throw new BadRequestException(['code already been applied']);
    }
    if (this.emailConfirmation?.expirationDate && this.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException(['code is expired']);
    }

    this.isEmailConfirmed = true;
    if (this.emailConfirmation) {
      this.emailConfirmation = {
        ...this.emailConfirmation,
        isConfirmed: true,
      }
    }
  }

  updatePassword(passwordHash: string, salt: string) {
    this.passwordHash = passwordHash;
    this.salt = salt;
    
    // Очищаем recovery code после успешного обновления пароля
    if (this.emailConfirmation) {
      this.emailConfirmation = {
        ...this.emailConfirmation,
        confirmationCode: null,
        expirationDate: null,
      };
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
