
import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';

import { UsersService, type AuthUser } from '../users/users.service.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<AuthUser> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super({ realm: 'usuarios-roles-api' });

    registry.registerProvider(this);
  }

  validate({ sub }: JwtClaims) {
    return sub ? this.usersService.findById(sub) : null;
  }
}


