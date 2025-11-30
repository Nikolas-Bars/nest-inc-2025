import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { UserModelType } from '../domain/user.entity';
import { User } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserUseCase } from './use-cases/create-user-use-case';

@Injectable()
export class UsersService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private createUserUseCase: CreateUserUseCase,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const createdUserId = await this.createUserUseCase.execute(dto);

    const confirmCode = 'uuid';

    const user = await this.usersRepository.findOrNotFoundFail(createdUserId);

    user.setConfirmationCode(confirmCode);
  }

  async checkExistenceOfUser(email: string, login: string): Promise<boolean> {
    return await this.usersRepository.isUserExists(email, login);
  }
}
