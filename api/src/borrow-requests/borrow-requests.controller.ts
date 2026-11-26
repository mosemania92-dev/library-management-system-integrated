import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BorrowStatus, Role } from '@prisma/client';
import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowStatusDto } from './dto/update-borrow-status.dto';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowRequestsController {
  constructor(private readonly service: BorrowRequestsService) {}

  @Post()
  create(@Req() req: { user: { id: number } }, @Body() dto: CreateBorrowRequestDto) {
    return this.service.create(req.user.id, dto.bookId);
  }

  @Get('mine')
  mine(@Req() req: { user: { id: number } } ) {
    return this.service.mine(req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.LIBRARIAN)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBorrowStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
