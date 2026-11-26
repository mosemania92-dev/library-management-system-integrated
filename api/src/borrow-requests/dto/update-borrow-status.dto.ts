import { IsEnum } from 'class-validator';
import { BorrowStatus } from '@prisma/client';

export class UpdateBorrowStatusDto {
  @IsEnum(BorrowStatus)
  status: BorrowStatus;
}
