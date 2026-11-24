import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationPolicy } from './policies/reservation.policy.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly reservationPolicy: ReservationPolicy,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}

    private ensureActiveUser(user: User) {
        if (!user.isActive) {
            throw new ForbiddenException('El usuario no está activo');
        }
    }
    private ensureRole(user: User, roleName: string) {
        const hasRole = user.roles.some((role) => role.roleName === roleName);
        if (!hasRole) {
            throw new ForbiddenException(`El usuario no tiene el rol requerido: ${roleName}`);
        }
    }

    private toResponse(reservation: Reservation) {
        const spot = reservation.spot as unknown as { id?: string } | string;

        return {
            id: reservation.id, 
            userId: reservation.user.id,
            spotId: typeof spot === 'string' ? spot : spot?.id,
            date: reservation.date,
            vehiclePlate: reservation.vehiclePlate,
            vehiclemaxcharge: reservation.vehicleMaxCharge,
            status: reservation.status,
            createdAt: reservation.createdAt,
        };
    }

    async create(createReservationDto: CreateReservationDto, userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { roles: true },
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        this.ensureActiveUser(user);

        const reservation = this.reservationRepository.create({
            ...createReservationDto,
            user: user,
        });

        await this.reservationRepository.save(reservation);

        return this.toResponse(reservation);
    }

    async findAll() {
        const reservations = await this.reservationRepository.find({
            relations: { user: true },
        });

        return reservations.map((reservation) => this.toResponse(reservation));
    }

    async findOne(id: string) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: { user: true },
        });

        if (!reservation) {
            throw new NotFoundException('Reserva no encontrada');
        }

        return this.toResponse(reservation);
    }

    async update(id: string, updateReservationDto: Partial<CreateReservationDto>) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!reservation) {
            throw new NotFoundException('Reserva no encontrada');
        }

        Object.assign(reservation, updateReservationDto);
        await this.reservationRepository.save(reservation);
        return this.toResponse(reservation);
    }

    async remove(id: string) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
        });

        if (!reservation) {
            throw new NotFoundException('Reserva no encontrada');
        }
        await this.reservationRepository.remove(reservation);
    }
}
