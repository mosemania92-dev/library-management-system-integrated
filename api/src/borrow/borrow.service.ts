import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BorrowStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, bookId: number) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) throw new NotFoundException('Book not found');

      // Atomic decrement prevents two patrons taking the final available copy.
      const updated = await tx.book.updateMany({
        where: { id: bookId, copiesAvailable: { gt: 0 } },
        data: { copiesAvailable: { decrement: 1 } },
      });
      if (updated.count !== 1) {
        throw new ConflictException('No copies are currently available');
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      return tx.borrowRequest.create({
        data: { userId, bookId, dueDate },
        include: { book: true },
      });
    });
  }

  mine(userId: number) {
    return this.prisma.borrowRequest.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { borrowedAt: 'desc' },
    });
  }

  async returnBook(userId: number, requestId: number) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.borrowRequest.findFirst({
        where: { id: requestId, userId },
      });
      if (!request) throw new NotFoundException('Borrow request not found');
      if (request.status !== BorrowStatus.ACTIVE) {
        throw new ConflictException('This book has already been returned');
      }

      await tx.borrowRequest.update({
        where: { id: requestId },
        data: { status: BorrowStatus.RETURNED, returnedAt: new Date() },
      });
      await tx.book.update({
        where: { id: request.bookId },
        data: { copiesAvailable: { increment: 1 } },
      });
      return { message: 'Book returned successfully' };
    });
  }
}
