import { UserDocument } from '../../../domain/user.entity';
import { EmailConfirmationType } from '../../../types/email-confirmation.type';

export class UserExternalDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  firstName: string;
  lastName: string | null;
  emailConfirmation?: EmailConfirmationType

  static mapToView(user: UserDocument): UserExternalDto {
    const dto = new UserExternalDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.id = user._id.toString();
    dto.createdAt = user.createdAt;
    dto.firstName = user.name.firstName;
    dto.lastName = user.name.lastName;
    dto.emailConfirmation = user.emailConfirmation

    return dto;
  }
}
