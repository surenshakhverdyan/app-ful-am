import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBasketDto {
  @IsString()
  ligue: string;

  @IsArray()
  @IsNotEmpty()
  teams: string[];
}
