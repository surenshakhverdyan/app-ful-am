import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Position } from 'src/enums';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  position?: Position;

  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
