import { SendEmailType } from '../email.types';
import nodemailer from 'nodemailer';

export class EmailExternalService {
  constructor() {}

  async sendMessage(msgData: SendEmailType): Promise<boolean> {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,          // или 587 + secure: false
      secure: true,
      auth: {
        user: 'docum.magic0@gmail.com',
        pass: 'zsskjnikysdkmzhf',
      }
    })
    const a = transport.verify()
    console.log(a, 'a');
    const info = await transport.sendMail({
      from: '"Nikolas Bars" <docum.magic0@gmail.com>',
      to: msgData.path,
      subject: msgData.subject,
      html: msgData.msg
    })

    return true
  }

  async sendEmailConfirmationMassage(msgData: SendEmailType & { code: string }) {

    const message = `<h1>Thanks for your registration</h1><a href=\'https://blog-t57v.onrender.com/registration-confirmation?code=${msgData.code}\'>complete registration</a>`

    return await this.sendMessage({ ...msgData, msg: message})

  }

  // async sendRecoveryMail(email: string, subject: string, code: string) {
  //
  //   const message = ` <h1>Password recovery</h1><a href=\'https://blog-t57v.onrender.com/password-recovery?recoveryCode=${code}\'>recovery password</a>`
  //
  //   const result: string | null = await this.sendMessage(email, subject, message)
  //
  //   return result
  // }
}
