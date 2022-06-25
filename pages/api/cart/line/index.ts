import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "../../../../utils/apolloClient";

type Data = {
  cart: any;
  userErrors: any;
};

type CartLinesUpdateData = {
  cartLinesUpdate: any;
  userErrors: any;
};

type CartLinesRemoveData = {
  cartLinesRemove: any;
  userErrors: any;
};

const cartFields = `cart {
  id
  attributes {
    key
    value
  }
  buyerIdentity {
    email
    countryCode
    customer {
      id
      defaultAddress {
        address1
        address2
        city
        zip
        province
        provinceCode
        country
        countryCodeV2
      }
    }
  }
  checkoutUrl
  createdAt
  updatedAt
  discountCodes {
    code
    applicable
  }
  estimatedCost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalDutyAmount {
      amount
      currencyCode
    }
  }
  lines(first: 10) {
    edges {
      node {
        id
        attributes {
          key
          value
        }
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            quantityAvailable
            image {
              url
              width
              height
            }
            priceV2 {
              amount
              currencyCode
            }
            product {
              id
              title
              description
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
  note
}`;

const userErrorsFields = `
userErrors {
  field
  message
}
`;

const ADD_ITEM_TO_CART = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      ${cartFields}
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      ${cartFields}
      ${userErrorsFields}
    }
  }
`;

const REMOVE_CART_ITEM = gql`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      ${cartFields}
      ${userErrorsFields}
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | CartLinesUpdateData | CartLinesRemoveData>
) {
  const httpAction = req.method;

  if (httpAction === "POST") {
    // add cart item
    const { cartVariables } = req.body;
    const inputVars = {
      cartId: cartVariables.cartId,
      lines: cartVariables.lines,
    };
    const { data } = await client.mutate({
      mutation: ADD_ITEM_TO_CART,
      variables: inputVars,
    });

    res.status(200).json({
      cart: data?.cartLinesAdd?.cart,
      userErrors: data?.userErrors,
    });
  }

  if (httpAction === "PATCH") {
    // update cart item
    const { variables } = req.body;

    const { data } = await client.mutate({
      mutation: UPDATE_CART_ITEM,
      variables: variables,
    });
    res.status(200).json({
      cartLinesUpdate: data?.cartLinesUpdate,
      userErrors: data?.userErrors,
    });
  }

  if (httpAction === "DELETE") {
    const { variables } = req.body;
    const { data } = await client.mutate({
      mutation: REMOVE_CART_ITEM,
      variables: variables,
    });
    res.status(200).json({
      cartLinesRemove: data?.cartLinesRemove,
      userErrors: data?.userErrors,
    });
  }

  // res.status(200).json({ name: "John Doe" });
}
