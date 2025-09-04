import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService
      .findByEmail(createUserDto.email)
      .catch(() => null);
    if (existingUser) {
      throw new ConflictException(
        `Email "${createUserDto.email}" is already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return { id: newUser.id, email: newUser.email };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      country: user.country,
    };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
