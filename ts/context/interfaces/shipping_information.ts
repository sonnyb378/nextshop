export interface IShippingInformation {
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: {
    name: string;
    description: string;
  };
  phone: string;
}
