import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiResponse } from 'src/common/api-response';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return ApiResponse.success(user, 'User registered successfully');
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.login(loginUserDto);
    return ApiResponse.success(result, 'Login successful');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return ApiResponse.success(null, 'Logout successful.');
  }
}
