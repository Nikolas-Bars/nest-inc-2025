import { Injectable } from '@nestjs/common';
import { EmailExternalService } from '../../email/application/email-external.service';
import { RegistrationInputDto } from '../api/input-dto/registration.input-dto';
import { RegisterUserDto } from '../dto/register.user.dto';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../../user-accounts/dto/create-user.dto';
import { UsersExternalService } from '../../user-accounts/application/users.external-service';

@Injectable()
export class AuthService {
  constructor(
    private emailExternalService: EmailExternalService,
    private userExternalService: UsersExternalService,
  ) {}

  async registerUser(body: RegisterUserDto) {

    const salt = await bcrypt.genSalt(10)

    const passwordHash = await bcrypt.hash(body.password, salt)

    const user: CreateUserDto = {
      login: body.login,
      email: body.email,
      password: passwordHash,
      salt: salt,
    }

    return this.userExternalService.registrationUser(user)
  }
}
