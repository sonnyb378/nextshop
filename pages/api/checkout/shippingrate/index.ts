import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../utils/apolloClient";

import { checkoutFields } from "../index";

type CheckoutError = {
  code: string;
  field: string;
  message: string;
};

type Data = {
  checkout: any;
  checkoutUserErrors: [CheckoutError] | null;
};

const UPDATE_SHIPPING_LINE = gql`
  mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
    checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
      ${checkoutFields}
      checkoutUserErrors {
        code, field, message
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const method = req.method;

  const { checkoutId, shippingRateHandle } = req.body;
  const inputVars = {
    checkoutId,
    shippingRateHandle,
  };

  const { data, errors } = await client.mutate({
    mutation: UPDATE_SHIPPING_LINE,
    variables: inputVars,
  });
  res.status(200).json({
    checkout: data?.checkoutShippingLineUpdate.checkout,
    checkoutUserErrors: data?.checkoutShippingLineUpdate.checkoutUserErrors,
  });
}
