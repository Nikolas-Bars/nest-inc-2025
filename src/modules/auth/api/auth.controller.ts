import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { AuthService } from '../application/auth.service';
import { ConfirmCodePipe } from './pipes/confirm-code.pipe';
import { ExtractUserFromRequest } from '../decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../application/user-context.dto';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { LoginInputDto } from './input-dto/login.input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@UsePipes(RegistrationUserPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() body: RegistrationInputDto) {
    const res = await this.authService.registerUser(body);

    if (!res) {
      throw new BadRequestException('Something went wrong');
    }

    return true;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginInputDto, // ← ValidationPipe проверит DTO СНАЧАЛА
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. ValidationPipe проверил body (длина, формат) → 400 с указанием поля
    // 2. Проверяем логин/пароль вручную
    const user = await this.authService.validateUser(body);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // 401 если неверный логин/пароль
    }

    // 3. Генерируем JWT-токен для этого userId
    const tokens = await this.authService.login(user.userId);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,   // Защита от XSS (JS не может прочитать)
      secure: process.env.NODE_ENV === 'production',     // HTTPS только в проде
      sameSite: 'lax', // Защита от CSRF (lax для localhost)
      maxAge: 15 * 60 * 1000, // 15 минут (как у токена)
    });

    return tokens
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  @UseGuards(JwtAuthGuard)
  async confirmationCode(@Query('code', ConfirmCodePipe) code: string) {
    await this.authService.confirmCode(code);
  }

  // Тестовый защищённый маршрут для проверки JWT
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@ExtractUserFromRequest() user: UserContextDto) {
    return {
      message: 'JWT работает!',
      user: {
        userId: user.userId,
        login: user.login,
      },
    };
  }
}
