import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepository } from '../../user-accounts/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'LoginIsExist', async: true })
@Injectable()
export class LoginIsExistDecorator implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}
  async validate(loginOrEmail: string, args: ValidationArguments): Promise<boolean> {
    return !await this.usersRepository.checkByLoginOrEmail(loginOrEmail);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'user with this login already exists';
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function LoginIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LoginIsExistDecorator,
    });
  };
}
