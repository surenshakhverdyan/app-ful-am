export interface IPopulatedBasket {
  _id: string;
  ligue: string;
  teams: [
    {
      _id: string;
      user: {
        _id: string;
        email: string;
      };
    },
  ];
}
