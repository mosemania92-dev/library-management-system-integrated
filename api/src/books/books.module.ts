import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
