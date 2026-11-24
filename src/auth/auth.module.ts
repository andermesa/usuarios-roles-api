
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { CredentialsService } from './credentials.service.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { AuthController } from './auth.controller.js';
import { AdminPolicy } from './policies/admin.policy.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    CredentialsService,
    JwtAuth,
    AdminPolicy,
  ],
})
export class AuthModule {}

