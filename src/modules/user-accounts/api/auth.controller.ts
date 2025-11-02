import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../application/users.service';
import { RegistrationUserPipe } from '../../auth/api/pipes/registration.user.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService
  ) {}

  @Post()
  @UsePipes(RegistrationUserPipe)
  registration(@Body() body: CreateUserDto): Promise<void> {
    return this.usersService.registerUser(body);
  }
}
