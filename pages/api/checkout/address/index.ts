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

const UPDATE_CHECKOUT_SHIPPING_ADDRESS = gql`
  mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
    checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
      ${checkoutFields}
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { checkoutId, shippingAddress } = req.body;

  const { data, errors } = await client.mutate({
    mutation: UPDATE_CHECKOUT_SHIPPING_ADDRESS,
    variables: {
      checkoutId,
      shippingAddress,
    },
  });
  res.status(200).json({
    checkout: data?.checkoutShippingAddressUpdateV2.checkout,
    checkoutUserErrors: data?.checkoutShippingAddressUpdateV2.checkoutUserErrors,
  });
}
