import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "../../../utils/apolloClient";
import Error from "next/error";

// customer signup

type Data = {
  customerCreate: any;
};

const REGISTER_CUSTOMER = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
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
  const { firstName, lastName, email, password, acceptsMarketing } = req.body;
  // console.log(firstName, lastName, email, password, acceptsMarketing);

  try {
    const { data } = await client.mutate({
      mutation: REGISTER_CUSTOMER,
      variables: {
        input: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          acceptsMarketing: acceptsMarketing,
        },
      },
    });
    console.log("customerCreate: ", data);
    res.status(200).json({ customerCreate: data?.customerCreate });
  } catch (e: any) {
    res.status(200).json({
      customerCreate: {
        customer: null,
        customerUserErrors: {
          field: ["LIMIT"],
          code: "Limit Exceeded",
          message: e.message,
        },
      },
    });
  }
}
