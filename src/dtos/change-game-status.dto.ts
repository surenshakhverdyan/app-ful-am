import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeGameStatusDto {
  @IsNotEmpty()
  @IsString()
  gameId: Types.ObjectId;
}
