
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { User } from './users/entities/user.entity.js';
import { Role } from './roles/entities/role.entity.js';

import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASS'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [User, Role],
        synchronize: false,
      }),
    }),

    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        allowInMemoryStorage: true,
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'usuarios-roles-api',
          audience: 'usuarios-roles-client',
          ttl: config.getOrThrow<'2m'>('JWT_EXPIRES_IN'),
        },
        refreshToken: {
          ttl: config.getOrThrow<'7d'>('JWT_REFRESH_EXPIRES_IN'),
        },
      }),
    }),

    // El guard de autorización debe ir después del de autenticación.
    AuthorizationModule.forRoot(),

    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



