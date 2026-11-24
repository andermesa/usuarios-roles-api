import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,

} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { ReservationStatus } from './reservation-status.enum.js';   

@Entity({ name: 'reservations' })
@Index(['user', 'status'])
@Index(['status', 'createdAt'])
@Index(['user', 'spot', 'date'], { unique: true })

export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    @JoinColumn({ name: 'id_user' })
    user!: User;

    @Column({ name: 'id_spot', type: 'varchar', length: 50 })
    spot!: string;

    @Column({ type: 'date' })
    date!: Date;

    @Column({ name: 'vehicle_plate', type: 'varchar', length: 20 })
    vehiclePlate!: string;

    @Column({ name: 'vehicle_max_charge', type: 'numeric', precision: 10, scale: 2 })
    vehicleMaxCharge!: number;

    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
    status!: ReservationStatus;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}