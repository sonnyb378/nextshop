import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../utils/apolloClient";

import { checkoutFields, checkoutFieldsPartial } from "../index";

type CheckoutError = {
  code: string;
  field: string;
  message: string;
};

type Data = {
  checkout: any;
  checkoutUserErrors: [CheckoutError] | null;
};

const CHECKOUT_LINE_ADD = gql`
  mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      ${checkoutFieldsPartial}
      checkoutUserErrors {
        code, field, message
      }
    }
  }
`;

const CHECKOUT_LINE_REMOVE = gql`
  mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
      ${checkoutFieldsPartial}
      checkoutUserErrors {
        code, field, message
      }
    }
  }
`;

const CHECKOUT_LINE_UPDATE = gql`
mutation checkoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
  checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
    ${checkoutFieldsPartial}
    checkoutUserErrors {
      code, field, message
    }
  }
}
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const method = req.method;

  if (method === "POST") {
    const { checkoutId, lineItems } = req.body;
    console.log(req.body);
    const inputVars = {
      checkoutId,
      lineItems,
    };
    const { data, errors } = await client.mutate({
      mutation: CHECKOUT_LINE_ADD,
      variables: inputVars,
    });
    res.status(200).json({
      checkout: data?.checkoutLineItemsAdd.checkout,
      checkoutUserErrors: data?.checkoutLineItemsAdd.checkoutUserErrors,
    });
  } else if (method === "PATCH") {
    const { checkoutId, lineItems } = req.body;
    // console.log("(patch) checkout line update: ", checkoutId, lineItems);
    const { data, errors } = await client.mutate({
      mutation: CHECKOUT_LINE_UPDATE,
      variables: {
        checkoutId,
        lineItems,
      },
    });
    res.status(200).json({
      checkout: data?.checkoutLineItemsUpdate.checkout,
      checkoutUserErrors: data?.checkoutLineItemsUpdate.checkoutUserErrors,
    });
  } else if (method === "DELETE") {
    const { checkoutId, lineItemIds } = req.body;

    const { data, errors } = await client.mutate({
      mutation: CHECKOUT_LINE_REMOVE,
      variables: {
        checkoutId,
        lineItemIds,
      },
    });

    res.status(200).json({
      checkout: data?.checkoutLineItemsRemove.checkout,
      checkoutUserErrors: data?.checkoutLineItemsRemove.checkoutUserErrors,
    });
  }
}
