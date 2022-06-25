import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "../../../utils/apolloClient";

// login customer
type Data = {
  customerAccessTokenCreate: any;
};

const LOGIN_CUSTOMER = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // const httpAction = req.method;

  // if (httpAction === "POST") {
  const { input } = req.body;

  console.log(input.email);

  const { data } = await client.mutate({
    mutation: LOGIN_CUSTOMER,
    variables: {
      input: {
        email: input.email,
        password: input.password,
      },
    },
  });
  // }

  res.status(200).json({ customerAccessTokenCreate: data?.customerAccessTokenCreate });
}
