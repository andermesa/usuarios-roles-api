
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Post,
} from '@nestjs/common';

import { Public, TokenService } from '@nestjs/authentication';

import { CredentialsService } from './credentials.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.credentialsService.register(
      body.email,
      body.password,
      body.name,
      body.phone,
    );

    return {
      message: 'Usuario registrado con éxito',
      userId: user.id,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const user = await this.credentialsService.verify(
      body.email,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.tokenService.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshDto) {
    return this.tokenService.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: RefreshDto): Promise<void> {
    await this.tokenService.revoke(body.refreshToken);
  }
}


