import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UsersExternalQueryRepository } from '../infrastructure/external-query/users.external-query-repository';
import { UserExternalDto } from '../infrastructure/external-query/external-dto/users.external-dto';

@Injectable()
export class UsersExternalService {
  constructor(
    // инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersExternalQueryRepository,
  ) {}

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return await this.usersRepository.getByLoginOrEmail(loginOrEmail);
  }

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
      emailConfirmation: dto.emailConfirmation ? { ...dto.emailConfirmation } : null,
    });

    console.log(dto, 'dto.user');

    await this.usersRepository.save(user);

    return !!user._id.toString();
  }

  async checkUserByConfirmCode(code: string): Promise<UserExternalDto | null> {
    return this.usersQueryRepository.findByConfirmCode(code);
  }

  async confirmationCode(code: string) {
    const user = await this.usersRepository.getByConfirmCode(code)

    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log(333, user);
    user.confirmEmail();
    await this.usersRepository.save(user);
  }

  async save(user: UserDocument)  {
    await this.usersRepository.save(user);
  }

  async getUserByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
    console.log(recoveryCode, 666);
    return await this.usersRepository.getByConfirmCode(recoveryCode);
  }
}
