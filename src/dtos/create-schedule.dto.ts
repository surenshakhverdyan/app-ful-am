import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

import { Types } from 'mongoose';

export class CreateScheduleDto {
  @IsOptional()
  game?: Types.ObjectId;

  @IsOptional()
  team?: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  players: Types.ObjectId[];

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
