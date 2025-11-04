import { SendEmailType } from '../email.types';
import nodemailer from 'nodemailer';

export class EmailExternalService {
  constructor() {}

  async sendMessage(msgData: SendEmailType): Promise<any> {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,          // или 587 + secure: false
      secure: true,
      auth: {
        user: 'docum.magic0@gmail.com',
        pass: 'zsskjnikysdkmzhf',
      }
    })

    const a = await transport.verify()

    const info = await transport.sendMail({
      from: '"Nikolas Bars" <docum.magic0@gmail.com>',
      to: msgData.path,
      subject: 'Nikolas Bars Docum',
      html: msgData.msg
    })
  }
}
