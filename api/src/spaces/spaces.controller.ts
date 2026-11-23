import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSpaceBookingDto } from './space.dto';
import { SpacesService } from './spaces.service';

@Controller()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get('spaces')
  listSpaces() {
    return this.spacesService.list();
  }

  @UseGuards(JwtAuthGuard)
  @Post('space-bookings')
  book(@Req() req: { user: { id: number } }, @Body() dto: CreateSpaceBookingDto) {
    return this.spacesService.book(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('space-bookings/mine')
  myBookings(@Req() req: { user: { id: number } }) {
    return this.spacesService.mine(req.user.id);
  }
}
