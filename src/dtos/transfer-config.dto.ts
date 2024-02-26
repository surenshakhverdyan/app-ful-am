import { IsNotEmpty } from 'class-validator';

export class SetTransferDto {
  @IsNotEmpty()
  endTransfers: number;
}
