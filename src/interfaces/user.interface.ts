import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: string;
  team?: Types.ObjectId;
}
