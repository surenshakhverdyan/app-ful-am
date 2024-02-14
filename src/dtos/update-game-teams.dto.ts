import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateGameTeamsDto {
  @IsNotEmpty()
  team1: Types.ObjectId;

  @IsNotEmpty()
  team2: Types.ObjectId;

  @IsNotEmpty()
  dateTime: Date;
}
