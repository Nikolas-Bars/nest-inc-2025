import { Injectable } from '@nestjs/common';
import { EmailExternalService } from '../../email/application/email-external.service';
import { RegistrationInputDto } from '../api/input-dto/registration.input-dto';
import { RegisterUserDto } from '../dto/register.user.dto';
import bcrypt from 'bcrypt';
import {v1} from "uuid";
import add from "date-fns/add"
import { CreateUserDto } from '../../user-accounts/dto/create-user.dto';
import { UsersExternalService } from '../../user-accounts/application/users.external-service';
import { SendEmailType } from '../../email/email.types';

@Injectable()
export class AuthService {
  constructor(
    private emailExternalService: EmailExternalService,
    private userExternalService: UsersExternalService,
  ) {}

  async registerUser(body: RegisterUserDto) {

    const salt = await bcrypt.genSalt(10)

    const passwordHash = await bcrypt.hash(body.password, salt)

    const confirmationCode = v1()

    const user: CreateUserDto = {
      login: body.login,
      email: body.email,
      password: passwordHash,
      salt: salt,
      emailConfirmation: {
        // confirmationCode - код который уйдет пользователю
        confirmationCode,
        // expirationDate - дата когда код устареет
        expirationDate: add.add(new Date(), {
          hours: 1,
          minutes: 30
        }),
        isConfirmed: false
      }
    }

    await this.userExternalService.registrationUser(user)

    const msgData: SendEmailType & { code: string } = {
      path: body.email,
      msg: '',
      subject: 'Подтверждение регистрации!!!!!!!',
      code: confirmationCode
    };

    return await this.emailExternalService.sendEmailConfirmationMassage(msgData);
  }

  async confirmCode(code: string) {
    await this.userExternalService.confirmationCode(code)
  }
}
