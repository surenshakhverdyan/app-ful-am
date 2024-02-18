import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DeletePlayerDto {
  @IsString()
  @IsNotEmpty()
  playerId: Types.ObjectId;
}
