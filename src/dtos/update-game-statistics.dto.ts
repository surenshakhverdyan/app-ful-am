import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

class Goals {
  @IsOptional()
  @IsString()
  assist?: Types.ObjectId;

  @IsOptional()
  @IsString()
  goal?: Types.ObjectId;
}

class Cards {
  @IsOptional()
  @IsString()
  player?: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  yellow?: number;

  @IsOptional()
  @IsNumber()
  red?: number;
}

export class UpdateGameStatisticsDto {
  @IsString()
  @IsNotEmpty()
  gameId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  teamId: Types.ObjectId;

  @IsArray()
  @IsOptional()
  goals?: Goals[];

  @IsArray()
  @IsOptional()
  cards?: Cards[];
}
