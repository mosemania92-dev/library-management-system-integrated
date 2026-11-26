import {
  ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { BorrowStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, bookId: number) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) throw new NotFoundException('Book not found');
      const updated = await tx.book.updateMany({
        where: { id: bookId, copiesAvailable: { gt: 0 } },
        data: { copiesAvailable: { decrement: 1 } },
      });
      if (updated.count !== 1) throw new ConflictException('No copies are currently available');
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      return tx.borrowRequest.create({
        data: { userId, bookId, dueDate, status: BorrowStatus.ACTIVE },
        include: { book: true },
      });
    });
  }

  mine(userId: number) {
    return this.prisma.borrowRequest.findMany({
      where: { userId }, include: { book: true }, orderBy: { borrowedAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: BorrowStatus) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.borrowRequest.findUnique({ where: { id } });
      if (!request) throw new NotFoundException('Borrow request not found');
      if (request.status === BorrowStatus.RETURNED && status !== BorrowStatus.RETURNED) {
        throw new ConflictException('A returned request cannot be reopened');
      }
      const returning = status === BorrowStatus.RETURNED && request.status !== BorrowStatus.RETURNED;
      const returnDate = returning ? new Date() : request.returnedAt;
      const fineAmount = returning
        ? calculateFine(request.dueDate, returnDate, Number(process.env.FINE_RATE_PER_DAY ?? 10))
        : request.fineAmount;
      const updated = await tx.borrowRequest.update({
        where: { id },
        data: { status, ...(returning ? { returnedAt: returnDate, fineAmount } : {}) },
        include: { user: { select: { id: true, name: true, email: true } }, book: true },
      });
      if (returning) {
        await tx.book.update({
          where: { id: request.bookId }, data: { copiesAvailable: { increment: 1 } },
        });
      }
      return updated;
    });
  }

  listAll() {
    return this.prisma.borrowRequest.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, book: true },
      orderBy: { borrowedAt: 'desc' },
    });
  }
}
