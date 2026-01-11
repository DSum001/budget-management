import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // ตรวจสอบว่าอีเมลมีในระบบแล้วหรือไม่
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // สร้างผู้ใช้ใหม่
    const user = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      defaultCurrency: registerDto.defaultCurrency || 'THB',
      preferences: {
        language: 'th',
        theme: 'light',
        notifications: true,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
      },
    });

    // สร้าง JWT token
    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultCurrency: user.defaultCurrency,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // ตรวจสอบว่ามีผู้ใช้ในระบบหรือไม่
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // ตรวจสอบรหัสผ่าน
    // @ts-ignore - bcrypt types
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // อัพเดท last login
    await this.userService.updateLastLogin(user._id.toString());

    // สร้าง JWT token
    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultCurrency: user.defaultCurrency,
        preferences: user.preferences,
      },
      access_token: token,
    };
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
