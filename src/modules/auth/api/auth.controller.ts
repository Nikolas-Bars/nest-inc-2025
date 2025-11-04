import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { EmailExternalService } from '../../email/application/email-external.service';
import { SendEmailType } from '../../email/email.types';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private emailExternalService: EmailExternalService,
    private authService: AuthService,
  ) {}

  //@UsePipes(RegistrationUserPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() body: RegistrationInputDto) {
    const msgData: SendEmailType = {
      path: body.email,
      msg: 'blablabla',
    };

    await this.emailExternalService.sendMessage(msgData);

    console.log(456);

    const res = await this.authService.registerUser(body);

    if (!res) {
      throw new BadRequestException('Something went wrong');
    }

    return;
  }
}
