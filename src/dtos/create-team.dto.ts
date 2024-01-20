import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

import { Position } from 'src/enums';

class PlayerDTO {
  @IsString()
  name: string;

  @IsNumber()
  @ArrayUnique()
  number: number;

  @IsEnum(Position)
  position: Position;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  user?: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  players: PlayerDTO[];
}
