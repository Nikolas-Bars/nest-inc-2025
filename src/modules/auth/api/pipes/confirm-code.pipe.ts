import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersExternalService } from '../../../user-accounts/application/users.external-service';

@Injectable()
export class ConfirmCodePipe implements PipeTransform {
  constructor(private readonly usersExternalService: UsersExternalService) {}

  async transform(code) {
    const user = await this.usersExternalService.checkUserByConfirmCode(code)

    console.log(user, 'user');
    if (!user || (user && user.emailConfirmation?.expirationDate && (user.emailConfirmation.expirationDate < new Date() || user.emailConfirmation.isConfirmed))) {
      throw new BadRequestException([{ message: 'invalid confirmation code', field: "code" }]);
    }

    return code;
  }
}
