import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBasketDto {
  @IsString()
  league: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  teams: Types.ObjectId[];
}
