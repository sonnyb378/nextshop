export interface IDeliveryMethod {
  handle: string;
  title: string;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
}
