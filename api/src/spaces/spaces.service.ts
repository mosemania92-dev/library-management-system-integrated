import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.space.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
      select: { id: true, name: true, description: true, capacity: true },
    });
  }

  async book(userId: number, dto: { spaceId: number; date: string; startTime: string; endTime: string }) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('endTime must be later than startTime');
    }
    const date = new Date(`${dto.date.slice(0, 10)}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid booking date');
    if (date < new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z')) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const space = await tx.space.findFirst({
          where: { id: dto.spaceId, isActive: true },
        });
        if (!space) throw new NotFoundException('Space not found or inactive');

        const overlap = await tx.booking.findFirst({
          where: {
            spaceId: dto.spaceId,
            date,
            status: 'CONFIRMED',
            startTime: { lt: dto.endTime },
            endTime: { gt: dto.startTime },
          },
        });
        if (overlap) throw new ConflictException('This space is already booked for that time');

        return tx.booking.create({
          data: {
            userId,
            spaceId: dto.spaceId,
            date,
            startTime: dto.startTime,
            endTime: dto.endTime,
          },
          include: { space: true },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException('This space was booked at the same time. Please choose another slot.');
      }
      throw error;
    }
  }

  mine(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { space: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }
}
