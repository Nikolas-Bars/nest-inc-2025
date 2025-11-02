import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { RegistrationUserPipe } from './pipes/registration.user.pipe';
import nodemailer from 'nodemailer';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UsePipes(RegistrationUserPipe)
  @Post('/registration')
  async registration(@Body() body: RegistrationInputDto) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'docum.magic0@gmail.com',
        pass: 'gyrnlrvparkpqmwy',
      }
    })
    console.log(123);
    const info = await transport.sendMail({
      from: 'Nikolas Bars <docum.magic0@gmail.com>',
      to: 'kasp2409@@mail.ru',
      subject: 'Nikolas Bars Docum',
      html: `<h1>asdadsasdasdasdsa</h1>`
    })
    console.log(456);
    return info;
  }
}
