
# Sistema de Usuarios y Roles - NestJS

**Autor:** Anderson Mesa  
**Universidad:** Universidad de los Andes  
**Asignatura:** Programación con Tecnologías Web - ISIS3710

## Descripción

API REST desarrollada con NestJS para administrar usuarios, roles y permisos. Implementa autenticación mediante JWT, rotación de refresh tokens, autorización basada en políticas y persistencia en PostgreSQL mediante TypeORM.

## Tecnologías

- NestJS 12
- TypeScript
- PostgreSQL 16
- Docker y Docker Compose
- TypeORM
- @nestjs/authentication
- @nestjs/authorization
- class-validator
- scrypt para protección de contraseñas

## Modelos

### User

- id: UUID
- email: String, único y obligatorio
- password: String, hash scrypt
- name: String
- phone: String, opcional
- is_active: Boolean
- created_at: Timestamp

### Role

- id: UUID
- role_name: String, único
- description: String, opcional

Relación muchos a muchos mediante la tabla user_roles.

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
cd usuarios-roles-api
npm install
```

Crear el archivo .env a partir de .env.example y configurar las credenciales.

## Base de datos

Iniciar PostgreSQL:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Ejecutar migraciones:

```bash
npm run typeorm -- migration:run -d src/data-source.ts
```

## Ejecutar la API

Modo desarrollo:

```bash
npm run start:dev
```

Compilar:

```bash
npm run build
```

La API estará disponible en:

http://localhost:3000

## Endpoints

| Método | URI | Acceso |
|---|---|---|
| POST | /auth/register | Público |
| POST | /auth/login | Público |
| POST | /auth/refresh | Público |
| POST | /auth/logout | Público |
| POST | /roles | Admin |
| GET | /roles | Admin |
| PATCH | /users/:id/roles | Admin |
| GET | /users/me | Autenticado |
| GET | /users | Admin |

## Autenticación

- Access token: 2 minutos.
- Refresh token: 7 días.
- Rotación de refresh tokens.
- Revocación al cerrar sesión.
- Almacenamiento de refresh tokens en memoria.

El almacenamiento en memoria pierde las sesiones activas al reiniciar el servidor.

## Autorización

Se utiliza control de acceso basado en roles y políticas.

El rol admin puede gestionar roles y usuarios. Las rutas protegidas requieren un token Bearer válido y los permisos correspondientes.

## Pruebas realizadas

- Registro de usuarios.
- Inicio de sesión.
- Generación de access y refresh tokens.
- Renovación y rotación del refresh token.
- Cierre de sesión y revocación del refresh token.
- Creación de roles.
- Asignación de roles a usuarios.
- Consulta del perfil propio.
- Listado de usuarios.
- Restricción de acceso para usuarios sin permisos.

## Scripts SQL

Los siguientes archivos contienen el esquema y las pruebas de base de datos:

- database/usuarios_roles_schema.sql
- database/usuarios_roles_tests.sql

## Seguridad

- Contraseñas almacenadas mediante hash scrypt.
- Validación de entradas mediante DTOs.
- El campo password no se devuelve en las respuestas.
- Las credenciales y secretos se mantienen en .env.
- El archivo .env no debe publicarse en GitHub.
