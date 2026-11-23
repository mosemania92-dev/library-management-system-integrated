import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BorrowService } from './borrow.service';
import { CreateBorrowRequestDto } from './borrow.dto';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Req() req: { user: { id: number } }, @Body() dto: CreateBorrowRequestDto) {
    return this.borrowService.create(req.user.id, dto.bookId);
  }

  @Get('mine')
  mine(@Req() req: { user: { id: number } }) {
    return this.borrowService.mine(req.user.id);
  }

  @Post(':id/return')
  returnBook(@Req() req: { user: { id: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.borrowService.returnBook(req.user.id, id);
  }
}
