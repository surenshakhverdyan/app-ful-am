import { Position } from 'src/enums';

export interface IPlayer {
  name: string;
  number: number;
  position: Position;
  avatar?: string;
  goals?: object;
  cards?: object;
  assist?: number;
}
