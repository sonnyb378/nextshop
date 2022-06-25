import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";

import client from "../../../utils/apolloClient";

type DefaultAddress = {
  id: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  provinceCode: string;
  zip: string;
  countryCodeV2: string;
  country: string;
};
type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultAddress: DefaultAddress;
};

type CustomerAddressError = {
  code: string;
  field: [string];
  message: string;
};

type Data = {
  customerDefaultAddressUpdate: Customer;
  customerUserErrors: [CustomerAddressError];
};

const SET_DEFAULT_ADDRESS = gql`
  mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
    customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
      customer {
        id
        email
        firstName
        lastName
        defaultAddress {
          id
          address1
          address2
          city
          province
          provinceCode
          zip
          countryCodeV2
          country
        }
        addresses(first: 10) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              provinceCode
              zip
              countryCodeV2
              country
              latitude
              longitude
            }
          }
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { addressId, accessToken } = req.body;

  const { data } = await client.mutate({
    mutation: SET_DEFAULT_ADDRESS,
    variables: {
      addressId: addressId,
      customerAccessToken: accessToken,
    },
  });
  // console.log(">>> ", data?.customerDefaultAddressUpdate.customer?.defaultAddress);
  res.status(200).json({
    customerDefaultAddressUpdate: data?.customerDefaultAddressUpdate,
    customerUserErrors: data?.customerUserErrors,
  });
}
