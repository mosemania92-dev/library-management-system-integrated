import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsString, Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @Type(() => Number) @IsInt() @Min(1)
  spaceId: number;

  @IsDateString()
  date: string;

  @IsString() @Matches(/^([01]\\d|2[0-3]):[0-5]\\d$/)
  startTime: string;

  @IsString() @Matches(/^([01]\\d|2[0-3]):[0-5]\\d$/)
  endTime: string;
}
