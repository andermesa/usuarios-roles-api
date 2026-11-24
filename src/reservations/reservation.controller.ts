import {
   Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post, 
} from '@nestjs/common';

import { Can } from '@nestjs/authorization';
import { CurrentUser } from '@nestjs/authentication';

import { ReservationService } from './reservation.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { AdminPolicy } from '../auth/policies/admin.policy.js';
import type { AuthUser } from '../users/users.service.js';

type UpdateReservationDto = Partial<CreateReservationDto>;

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() body: CreateReservationDto,
      @CurrentUser() user: AuthUser,
    ) {
      const reservation = await this.reservationService.create(body, user.id);

        return {
            message: 'Reserva creada con éxito',
            reservationId: reservation.id,
        };
    }

    @Get()
    @Can(AdminPolicy, 'manage')
    findAll() {
        return this.reservationService.findAll();
    }

    @Get(':id')
    @Can(AdminPolicy, 'manage')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.reservationService.findOne(id);
    }

    @Patch(':id')
    @Can(AdminPolicy, 'manage')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateReservationDto,
    ) {
        const reservation = await this.reservationService.update(id, body); 

        return {
            message: 'Reserva actualizada con éxito',
            reservationId: reservation.id,
        };
    }

    @Delete(':id')
    @Can(AdminPolicy, 'manage')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.reservationService.remove(id);   

        return {
            message: 'Reserva eliminada con éxito',
            reservationId: id,
        };
    }
}

