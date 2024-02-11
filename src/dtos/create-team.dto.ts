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

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  team?: Types.ObjectId;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  user?: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  players: PlayerDTO[];
}
