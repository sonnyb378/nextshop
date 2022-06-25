export interface IAddress {
  node: {
    company: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    country: string;
    countryCodeV2: string;
    id: string;
    latitude: string;
    longitude: string;
    province: string;
    provinceCode: string;
    zip: string;
    phone: string;
  };
}
export interface IDefaultAddress {
  id: string;
  country: string;
  countryCodeV2: string;
}
export interface IUserAddress {
  defaultAddress: IDefaultAddress | null;
  addresses: [IAddress] | null;
}

export interface IAddressStruct {
  isOpen: boolean;
  addressId: string | null;
  address: string | null;
}
