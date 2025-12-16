import { Global, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  exports: [PasswordService],
  providers: [PasswordService],
})
export class CoreModule {}
