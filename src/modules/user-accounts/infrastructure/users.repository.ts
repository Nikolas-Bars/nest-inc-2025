import { InjectModel } from '@nestjs/mongoose';
import type { UserModelType } from '../domain/user.entity';
import { User, UserDocument } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmationEmailInputDto } from '../../auth/dto/confirmation.email.input.dto';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(user: UserDocument) {
    // // Явно указываем Mongoose, что вложенный объект emailConfirmation был изменён
    // // Это необходимо, т.к. Mongoose не всегда отслеживает изменения вложенных объектов типа Object
    // if (user.isModified('emailConfirmation') || user.emailConfirmation) {
    //   user.markModified('emailConfirmation');
    // }
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async checkByLoginOrEmail(loginOrEmail: string): Promise<boolean> {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return !!user;
  }

  async getByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async getByConfirmCode(code: string): Promise<UserDocument | null> {
      return this.UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async isUserExists(email: string, login: string): Promise<boolean>  {
    const user = await this.UserModel.findOne({
      $or: [{ login: login }, { email: email }],
    });

    return !!user;
  }
}
