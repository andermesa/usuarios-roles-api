
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdmin1795542322604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const name = process.env.ADMIN_NAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!email || !name || !passwordHash?.startsWith('$scrypt$')) {
      throw new Error('Faltan datos del administrador o el hash scrypt');
    }

    const [role] = await queryRunner.query(
      `INSERT INTO "roles" ("role_name", "description")
       VALUES ($1, $2)
       ON CONFLICT ("role_name")
       DO UPDATE SET "description" = EXCLUDED."description"
       RETURNING "id"`,
      ['admin', 'Administrador del sistema'],
    );

    const [user] = await queryRunner.query(
      `INSERT INTO "users" ("email", "password", "name", "is_active")
       VALUES ($1, $2, $3, true)
       ON CONFLICT ("email")
       DO UPDATE SET "password" = EXCLUDED."password"
       RETURNING "id"`,
      [email, passwordHash, name],
    );

    await queryRunner.query(
      `INSERT INTO "user_roles" ("user_id", "role_id")
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [user.id, role.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!email) {
      throw new Error('Falta ADMIN_EMAIL');
    }

    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" = $1`,
      [email],
    );

    await queryRunner.query(
      `DELETE FROM "roles"
       WHERE "role_name" = 'admin'
       AND NOT EXISTS (
         SELECT 1 FROM "user_roles"
         WHERE "user_roles"."role_id" = "roles"."id"
       )`,
    );
  }
}

