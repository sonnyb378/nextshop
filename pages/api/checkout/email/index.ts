import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkoutFieldsPartial } from "..";
import client from "../../../../utils/apolloClient";

type CheckoutError = {
  code: string;
  field: string;
  message: string;
};

type Data = {
  checkout: any;
  checkoutUserErrors: [CheckoutError] | null;
};

const UPDATE_CHECKOUT_EMAIL = gql`
  mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {
      ${checkoutFieldsPartial}
      checkoutUserErrors {
        code, field, message
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const method = req.body;

  if (method === "PATCH") {
    // checkoutEmailUpdateV2
    const { checkoutId, email } = req.body;

    const { data } = await client.mutate({
      mutation: UPDATE_CHECKOUT_EMAIL,
      variables: {
        checkoutId,
        email,
      },
    });

    res.status(200).json({
      checkout: data?.checkoutEmailUpdateV2.checkout,
      checkoutUserErrors: data?.checkoutEmailUpdateV2.checkoutUserErrors,
    });
  }
}
