import { TokenType } from 'src/enums';

export interface IPayload {
  sub: string;
  role: string;
  type: TokenType;
  iat?: Date;
  exp?: Date;
}
