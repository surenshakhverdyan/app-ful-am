import { Types } from 'mongoose';

export interface IPopulatedBasket {
  _id: Types.ObjectId;
  league: Types.ObjectId;
  teams: [
    {
      _id: Types.ObjectId;
      user: {
        _id: Types.ObjectId;
        email: string;
      };
    },
  ];
}
