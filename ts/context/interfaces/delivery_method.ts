export interface IDeliveryMethod {
  type: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}
