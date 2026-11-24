import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateReservationDto {
    @IsUUID()
    userId!: string;

    @IsDateString()
    @IsNotEmpty()
    reservationDate!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(500)
    description!: string;
}
