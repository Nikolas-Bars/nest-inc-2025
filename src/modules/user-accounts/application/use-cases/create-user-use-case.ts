import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { PasswordService } from 'src/core/services/password.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService, // ← Добавляем PasswordService
  ) {}

  async execute(dto: CreateUserDto): Promise<string> {
    // Используем PasswordService вместо прямого вызова bcrypt
    const { hash: passwordHash, salt } = await this.passwordService.hashPassword(dto.password);

    const user = this.usersRepository.create({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }
}
