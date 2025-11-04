import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersExternalService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async makeUserAsSpammer(userId: string) {
    const user = await this.usersRepository.findOrNotFoundFail(userId);

    // user.makeSpammer();

    await this.usersRepository.save(user);
  }

  async checkExistenceOfUser(email: string, login: string): Promise<boolean> {
    return await this.usersRepository.isUserExists(email, login);
  }

  async registrationUser(dto: CreateUserDto) {

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: dto.password,
      salt: dto.salt,
    });

    await this.usersRepository.save(user);

    return !!user._id.toString();
  }
}
