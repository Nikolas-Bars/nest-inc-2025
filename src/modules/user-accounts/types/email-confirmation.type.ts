import { v1 } from 'uuid';
import add from 'date-fns/add';

export type EmailConfirmationType = {
  // confirmationCode - код который уйдет пользователю
  confirmationCode: string | null,
  // expirationDate - дата когда код устареет
  expirationDate: Date | null,
  isConfirmed: boolean
} | null
