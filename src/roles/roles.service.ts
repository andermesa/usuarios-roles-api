
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(roleName: string, description?: string) {
    const normalizedName = roleName.trim().toLowerCase();

    const existing = await this.rolesRepository.findOne({
      where: { roleName: normalizedName },
    });

    if (existing) {
      throw new ConflictException('role_name ya existe');
    }

    try {
      const role = this.rolesRepository.create({
        roleName: normalizedName,
        description: description?.trim() || null,
      });

      return await this.rolesRepository.save(role);
    } catch (error) {
      const dbError = error as { code?: string };

      if (dbError.code === '23505') {
        throw new ConflictException('role_name ya existe');
      }

      throw error;
    }
  }

  async findAll() {
    const roles = await this.rolesRepository.find({
      order: { roleName: 'ASC' },
    });

    return roles.map((role) => ({
      id: role.id,
      role_name: role.roleName,
      description: role.description,
    }));
  }
}


