import { Module } from '@nestjs/common';
import { BorrowRequestsController } from './borrow-requests.controller';
import { BorrowRequestsService } from './borrow-requests.service';

@Module({ controllers: [BorrowRequestsController], providers: [BorrowRequestsService], exports: [BorrowRequestsService] })
export class BorrowRequestsModule {}
