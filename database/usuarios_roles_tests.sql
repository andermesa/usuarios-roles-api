-- PREPARCIAL: SISTEMA DE USUARIOS Y ROLES
-- Universidad de los Andes
-- Autor: Anderson Mesa
-- Base de datos: usuarios_roles_db

BEGIN;

-- Crear los roles de prueba si todavía no existen.
INSERT INTO roles (role_name, description)
VALUES
    ('admin', 'Administrador del sistema'),
    ('supervisor', 'Rol de supervisor')
ON CONFLICT (role_name) DO NOTHING;

-- Asignar supervisor al usuario de prueba, si existe.
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'estudiante@prueba.com'
AND r.role_name = 'supervisor'
ON CONFLICT DO NOTHING;

COMMIT;

-- PRUEBA 1: Consultar usuarios.
SELECT id, email, name, phone, is_active, created_at
FROM users
ORDER BY created_at;

-- PRUEBA 2: Consultar roles.
SELECT id, role_name, description
FROM roles
ORDER BY role_name;

-- PRUEBA 3: Comprobar la relación muchos a muchos.
SELECT
    u.email,
    r.role_name
FROM users u
INNER JOIN user_roles ur ON u.id = ur.user_id
INNER JOIN roles r ON r.id = ur.role_id
ORDER BY u.email, r.role_name;

-- PRUEBA 4: Comprobar cantidad de usuarios y roles.
SELECT
    (SELECT COUNT(*) FROM users) AS total_usuarios,
    (SELECT COUNT(*) FROM roles) AS total_roles,
    (SELECT COUNT(*) FROM user_roles) AS total_asignaciones;
