import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { AuthService } from '../application/auth.service';
import { ConfirmCodePipe } from './pipes/confirm-code.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    const res = await this.authService.confirmCode(code);
    console.log(res, 'res');
    return true;
  }
}
