import { IsIn } from 'class-validator';
import { ReservationStatus } from '../entities/reservation-status.enum.js';

export class UpdateReservationStatusDto {
  @IsIn(Object.values(ReservationStatus))
  status!: ReservationStatus;
}
