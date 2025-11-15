// src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { AuthExternalService } from './application/auth-external.service';
import { EmailModule } from '../email/email.module';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    forwardRef(() => UserAccountsModule),
    PassportModule,
    EmailModule,
    ThrottlerModule.forRoot([{
      ttl: 10000,  // 10 секунд
      limit: 5,    // 5 попыток
    }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET || 'secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthExternalService, JwtStrategy, LocalStrategy],
  exports: [AuthExternalService], // публичный фасад
})
export class AuthModule {}
