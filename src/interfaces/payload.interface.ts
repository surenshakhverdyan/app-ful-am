import { Types } from 'mongoose';

export interface IPayload {
  sub: Types.ObjectId | string;
  role: string;
  type: string;
  iat?: Date;
  exp?: Date;
}
