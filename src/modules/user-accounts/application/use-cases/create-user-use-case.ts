import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }
}
