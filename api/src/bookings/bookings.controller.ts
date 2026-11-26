import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  create(@Req() req: { user: { id: number } }, @Body() dto: CreateBookingDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('mine')
  mine(@Req() req: { user: { id: number } }) { return this.service.mine(req.user.id); }
}
