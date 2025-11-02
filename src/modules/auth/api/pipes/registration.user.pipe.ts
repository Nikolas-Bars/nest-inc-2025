import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersExternalService } from '../../../user-accounts/application/users.external-service';

@Injectable()
export class RegistrationUserPipe implements PipeTransform {
  constructor(private readonly usersExternalService: UsersExternalService) {}

  async transform(data) {
    const { login, email } = data;

    const existingUser = await this.usersExternalService.checkExistenceOfUser(email, login)

    if (existingUser) {
      throw new BadRequestException('User with this login or email already exists');
    }

    return data;
  }
}
