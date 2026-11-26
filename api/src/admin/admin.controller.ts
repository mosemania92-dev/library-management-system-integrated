import { Controller, Get, Param, ParseIntPipe, Patch, Body, UseGuards } from '@nestjs/common';
import { BorrowStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BorrowRequestsService } from '../borrow-requests/borrow-requests.service';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBorrowStatusDto } from '../borrow-requests/dto/update-borrow-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
export class AdminController {
  constructor(
    private readonly borrowRequests: BorrowRequestsService,
    private readonly bookings: BookingsService,
  ) {}

  @Get('borrow-requests')
  listBorrowRequests() { return this.borrowRequests.listAll(); }

  @Patch('borrow-requests/:id/status')
  updateBorrowRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBorrowStatusDto,
  ) { return this.borrowRequests.updateStatus(id, dto.status); }

  @Get('bookings')
  listBookings() { return this.bookings.listAll(); }
}
