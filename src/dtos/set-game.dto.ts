import { IsDateString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class SetGameDto {
  @IsNotEmpty()
  team1: Types.ObjectId;

  @IsNotEmpty()
  team2: Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  dateTime: Date;
}
