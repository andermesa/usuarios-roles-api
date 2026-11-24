
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';

import { UsersService, type AuthUser } from './users.service.js';
import { AssignRolesDto } from './dto/assign-roles.dto.js';
import { AdminPolicy } from '../auth/policies/admin.policy.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Can.Anyone()
  getMe(@CurrentUser() user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles,
    };
  }

  @Get()
  @Can(AdminPolicy, 'manage')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/roles')
  @Can(AdminPolicy, 'manage')
  async assignRoles(
    @Param('id') id: string,
    @Body() body: AssignRolesDto,
  ) {
    await this.usersService.assignRoles(id, body.roles);

    return { message: 'Roles asignados' };
  }
}


