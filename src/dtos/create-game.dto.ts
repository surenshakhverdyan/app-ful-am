import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  league: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  basket: Types.ObjectId;
}
