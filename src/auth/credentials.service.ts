
import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const passwordHash = await this.passwordHasher.hash(password);

    return this.usersService.create({
      email,
      passwordHash,
      name,
      phone,
    });
  }

  async verify(email: string, password: string) {
    const found = await this.usersService.findCredentials(email);

    const valid = await this.passwordHasher.verify(
      password,
      found?.passwordHash,
    );

    if (!valid || !found) {
      return null;
    }

    if (!found.user.isActive) {
      throw new HttpException(
        'Usuario desactivado',
        HttpStatus.LOCKED,
      );
    }

    return found.user;
  }
}


