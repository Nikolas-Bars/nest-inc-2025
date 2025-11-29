import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailExternalService } from '../../email/application/email-external.service';
import { RegistrationInputDto } from '../api/input-dto/registration.input-dto';
import { RegisterUserDto } from '../dto/register.user.dto';
import bcrypt from 'bcrypt';
import {v1} from "uuid";
import { add } from "date-fns/add"
import { CreateUserDto } from '../../user-accounts/dto/create-user.dto';
import { UsersExternalService } from '../../user-accounts/application/users.external-service';
import { SendEmailType } from '../../email/email.types';
import { LoginInputDto } from '../api/input-dto/login.input.dto';
import { UserContextDto } from './user-context.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private emailExternalService: EmailExternalService,
    private userExternalService: UsersExternalService,
    private jwtService: JwtService,
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
        expirationDate: add(new Date(), {
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

  async login(userId: string, email: string, login: string) {
    const payload = { sub: userId, email, login }; // sub (subject) — стандартное поле JWT для userId
    console.log(payload, 'payload');
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_ACCESS_SECRET || 'secret',
    });

    return {
      accessToken,
    };
  }

  async checkPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  async passwordRecovery(email: string): Promise<void> {
    const user = await this.userExternalService.findByLoginOrEmail(email);

    // Всегда возвращаем успех (204), даже если email не найден
    // Это предотвращает обнаружение зарегистрированных email-адресов
    if (!user) {
      return;
    }

    const recoveryCode = v1();
    const exp = add(new Date(), {
      minutes: 3
    });

    // Обновляем код восстановления у пользователя
    user.setConfirmationCode(recoveryCode, exp);
    await this.userExternalService.save(user);

    // Отправляем email с кодом восстановления
    await this.emailExternalService.sendRecoveryMail(email, 'Recovery code', recoveryCode);
  }

  async checkRecoveryCode(code: string, password: string): Promise<void> {
    const user = await this.userExternalService.getUserByRecoveryCode(code);
    if (!user) {
      return; // Всегда возвращаем успех для безопасности
    }
    const expirationDate = user.emailConfirmation?.expirationDate || null;

    // Проверяем, что код не истёк
    if (!expirationDate || expirationDate < new Date()) {
      return; // Код истёк, но возвращаем успех для безопасности
    }
    // Создаём новый хэш пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Обновляем пароль через метод entity (DDD подход)
    user.updatePassword(passwordHash, salt);
    // Сохраняем изменения
    await this.userExternalService.save(user);
  }

  // Проверка логина/пароля (используется в LocalStrategy)
  async validateUser(data: LoginInputDto): Promise<UserContextDto | null> {
    const user = await this.userExternalService.findByLoginOrEmail(data.loginOrEmail);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user.id,
      login: user.login,
      email: user.email,
    };
  }

  async resendConfirmationCode(email: string): Promise<void> {

    const user = await this.userExternalService.findByLoginOrEmail(email)

    if (user && user.emailConfirmation) {

      const newCode = v1()

      const newExpirationDate = add(new Date(), {
        minutes: 3
      });

      const isConfirmed = user.emailConfirmation.isConfirmed

      if (isConfirmed) return // если email уже подтвержден

      // если не подтвержден - отправляем письмо заново

      user.setConfirmationCode(newCode, newExpirationDate);

      await this.userExternalService.save(user);

      const msgData: SendEmailType & { code: string } = {
        path: email,
        msg: '',
        subject: 'Подтверждение регистрации!!! ПОВТОРНО ЕПТА!',
        code: newCode
      };

      await this.emailExternalService.sendEmailConfirmationMassage(msgData);
    }
  }
}
