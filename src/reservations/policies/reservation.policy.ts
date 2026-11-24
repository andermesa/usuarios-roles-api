import { Policy } from '@nestjs/authorization';
import { Reservation } from '../entities/reservation.entity.js';
import type { AuthUser } from '../../users/users.service.js';

@Policy()
export class ReservationPolicy {
    create(user: AuthUser, reservation: Reservation): boolean {
        // Permitir la creación de reservas solo si el usuario tiene el rol "admin"
        return user.roles.some((role: string) => role === 'admin');
    }

    updateStatus(user: AuthUser, reservation: Reservation): boolean {
        // Permitir la actualización del estado de la reserva solo si el usuario tiene el rol "supervisor"
        return user.roles.some((role: string) => role === 'supervisor');

    }
    list(user: AuthUser, reservation: Reservation): boolean {
        // Permitir la visualización de reservas solo si el usuario tiene el rol "admin" o "supervisor" O "conductor-usuario"
        return (
            !!user?.isActive &&
            (user.roles.some((role: string) => role === 'admin') ||
                user.roles.some((role: string) => role === 'supervisor') ||
                user.roles.some((role: string) => role === 'user'))
        )
    }

    remove(user: AuthUser, reservation: Reservation): boolean {
        // Permitir la eliminación de reservas solo el usuario
        return user.roles.some((role: string) => role === 'user');
    }
}


