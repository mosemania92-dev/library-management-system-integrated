import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  private async assertGenre(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new BadRequestException(`Genre ${genreId} does not exist`);
  }

  async create(dto: CreateBookDto) {
    await this.assertGenre(dto.genreId);
    try {
      return await this.prisma.book.create({
        data: { ...dto, copiesAvailable: dto.totalCopies },
        include: { genre: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A book with this ISBN or title/author already exists');
      }
      throw e;
    }
  }

  async findAll(query: {
    genreId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));

    const where: Prisma.BookWhereInput = {};
    if (query.genreId) where.genreId = query.genreId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { genre: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const current = await this.findOne(id);
    if (dto.genreId) await this.assertGenre(dto.genreId);

    const data: Prisma.BookUncheckedUpdateInput = { ...dto };
    if (dto.totalCopies !== undefined) {
      const borrowed = current.totalCopies - current.copiesAvailable;
      data.copiesAvailable = Math.max(0, dto.totalCopies - borrowed);
    }
    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { genre: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A book with this ISBN or title/author already exists');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}
