
import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { Can } from '@nestjs/authorization';

import { RolesService } from './roles.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { AdminPolicy } from '../auth/policies/admin.policy.js';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Can(AdminPolicy, 'manage')
  async create(@Body() body: CreateRoleDto) {
    const role = await this.rolesService.create(
      body.role_name,
      body.description,
    );

    return {
      message: 'Rol creado con éxito',
      roleId: role.id,
    };
  }

  @Get()
  @Can(AdminPolicy, 'manage')
  findAll() {
    return this.rolesService.findAll();
  }
}


