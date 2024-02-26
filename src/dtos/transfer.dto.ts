import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class TransferDto {
  @IsNotEmpty()
  playerId: Types.ObjectId;
}
