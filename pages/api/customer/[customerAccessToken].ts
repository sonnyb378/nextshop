import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "../../../utils/apolloClient";

// get customer | get customer addresses

type Data = {
  customer: any;
};

const GET_CUSTOMER = gql`
  query getCustomer($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      id
      firstName
      lastName
      acceptsMarketing
      email
      phone
      displayName
      defaultAddress {
        id
        country
        countryCodeV2
      }
      addresses(first: 10) {
        edges {
          node {
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
            latitude
            longitude
            phone
          }
        }
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { customerAccessToken } = req.query;

  const { data } = await client.query({
    query: GET_CUSTOMER,
    variables: {
      accessToken: String(customerAccessToken),
    },
  });

  res.status(200).json({ customer: data?.customer });
}
