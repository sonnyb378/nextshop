import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";
import { gql } from "@apollo/client";

type CustomerAddressError = {
  code: string;
  field: [string];
  message: string;
};

type CustomerAddress = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  provinceCode: string;
  zip: string;
  countryCodeV2: string;
  country: string;
  latitude: string;
  longitude: string;
  phone: string;
};
type Data = {
  address: CustomerAddress;
  customerUserErrors: [CustomerAddressError];
};

type DeleteAddressData = {
  customerAddressDelete: {
    customerUserErrors: [CustomerAddressError];
    deletedCustomerAddressId: string;
  };
};

const POST_CUSTOMER_ADDRESS = gql`
  mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
    customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        zip
        countryCodeV2
        country
        phone
        latitude
        longitude
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const DELETE_ADDRESS = gql`
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | DeleteAddressData>
) {
  const httpAction = req.method;
  if (httpAction === "POST") {
    const { address, accessToken } = req.body;
    const { data } = await client.mutate({
      mutation: POST_CUSTOMER_ADDRESS,
      variables: {
        address: address,
        customerAccessToken: accessToken,
      },
    });

    res.status(200).json({
      address: data?.customerAddressCreate.customerAddress,
      customerUserErrors: data?.customerAddressCreate.customerUserErrors,
    });
  } else if (httpAction === "DELETE") {
    const { addressId, accessToken } = req.body;
    const { data } = await client.mutate({
      mutation: DELETE_ADDRESS,
      variables: {
        id: addressId,
        customerAccessToken: accessToken,
      },
    });
    res.status(200).json({
      customerAddressDelete: {
        customerUserErrors: data?.customerAddressDelete?.customerUserErrors,
        deletedCustomerAddressId: data?.customerAddressDelete?.deletedCustomerAddressId,
      },
    });
  }
}
