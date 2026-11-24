
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  isActive: boolean;
  roles: string[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      isActive: user.isActive,
      roles: (user.roles ?? []).map((role) => role.roleName),
    };
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
      relations: { roles: true },
    });

    return user ? this.toAuthUser(user) : null;
  }

  async findCredentials(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'role')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();

    if (!user) return null;

    return {
      user: this.toAuthUser(user),
      passwordHash: user.password,
    };
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { roles: true },
    });

    return user ? this.toAuthUser(user) : null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
  }): Promise<AuthUser> {
    const existing = await this.usersRepository.findOne({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    const user = this.usersRepository.create({
      email: data.email.trim().toLowerCase(),
      password: data.passwordHash,
      name: data.name,
      phone: data.phone ?? null,
      isActive: true,
      roles: [],
    });

    return this.toAuthUser(await this.usersRepository.save(user));
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: { roles: true },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: (user.roles ?? []).map((role) => role.roleName),
    }));
  }

  async assignRoles(userId: string, roleNames: string[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { roles: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!Array.isArray(roleNames) || roleNames.length === 0) {
      throw new BadRequestException('roles inválidos');
    }

    const names = roleNames.map((name) => name.trim().toLowerCase());

    if (names.some((name) => !name) || new Set(names).size !== names.length) {
      throw new BadRequestException('roles inválidos');
    }

    const roles = await this.rolesRepository.find({
      where: { roleName: In(names) },
    });

    if (roles.length !== names.length) {
      throw new BadRequestException('roles inválidos');
    }

    user.roles = roles;
    await this.usersRepository.save(user);

    return this.toAuthUser(user);
  }
}



