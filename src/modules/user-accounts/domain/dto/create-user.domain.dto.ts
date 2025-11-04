import { EmailConfirmationType } from '../../types/email-confirmation.type';

export class CreateUserDomainDto {
  login: string;
  email: string;
  passwordHash: string;
  salt?: string;
  emailConfirmation?: EmailConfirmationType | null;
}

