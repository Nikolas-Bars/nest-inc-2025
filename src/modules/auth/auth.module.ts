// src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthExternalService } from './application/auth-external.service';

@Module({
  imports: [
    forwardRef(() => UserAccountsModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthExternalService, JwtStrategy],
  exports: [AuthExternalService], // публичный фасад
})
export class AuthModule {}
