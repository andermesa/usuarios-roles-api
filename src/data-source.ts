
import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Role } from './roles/entities/role.entity.js';

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }

  return value;
};

export default new DataSource({
  type: 'postgres',
  host: requiredEnv('DB_HOST'),
  port: Number(requiredEnv('DB_PORT')),
  username: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASS'),
  database: requiredEnv('DB_NAME'),
  entities: [User, Role],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
