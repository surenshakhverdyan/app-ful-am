import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePlayerDto {
  @IsString()
  @IsNotEmpty()
  playerId: string;
}
