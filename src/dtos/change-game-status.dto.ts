import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeGameStatusDto {
  @IsNotEmpty()
  @IsString()
  gameId: string;
}
