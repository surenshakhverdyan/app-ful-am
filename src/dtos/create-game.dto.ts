import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  ligue: string;

  @IsString()
  @IsNotEmpty()
  basket: string;
}
