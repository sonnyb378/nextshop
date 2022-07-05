export interface IPaymentMethod {
  type: string;
  info: {
    cc: string;
    nameoncc: string;
    expdate: string;
    cvv: string;
  };
}
