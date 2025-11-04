import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { EmailExternalService } from '../../email/application/email-external.service';
import { SendEmailType } from '../../email/email.types';
import { AuthService } from '../application/auth.service';
import { ConfirmCodePipe } from './pipes/confirm-code.pipe';
import { ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  //@UsePipes(RegistrationUserPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() body: RegistrationInputDto) {

    const res = await this.authService.registerUser(body);

    if (!res) {
      throw new BadRequestException('Something went wrong');
    }

    return true;
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async confirmationCode(@Query('code', ConfirmCodePipe) code: string) {

    return true;

  }
}
