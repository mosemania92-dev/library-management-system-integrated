import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const exists = await this.prisma.genre.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Genre already exists');
    return this.prisma.genre.create({ data: dto });
  }

  findAll() {
    return this.prisma.genre.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);
    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    const books = await this.prisma.book.count({ where: { genreId: id } });
    if (books > 0) {
      throw new ConflictException('Cannot delete a genre that still has books');
    }
    return this.prisma.genre.delete({ where: { id } });
  }
}
