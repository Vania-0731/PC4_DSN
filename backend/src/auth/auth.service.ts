import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
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
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(registerDto.email, 'AuthApp', secret);

    const user = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      twoFactorSecret: secret,
      isTwoFactorEnabled: true,
    });

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      message: 'User registered successfully',
      qrCode: qrCodeUrl,
      secret: secret,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Credentials valid, please provide 2FA code',
      requiresTwoFactor: true,
      userId: user.id,
    };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.userService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = authenticator.verify({
      secret: user.twoFactorSecret,
      token: token,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
