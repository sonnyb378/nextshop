import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";

type Data = {
  cart: any;
  userErrors: any;
};

const CREATE_CART = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
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
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const method = req.method;
  const { cartVariables } = req.body;
  const inputVars = {
    input: cartVariables,
  };

  const { data } = await client.mutate({
    mutation: CREATE_CART,
    variables: inputVars,
  });

  res.status(200).json({
    cart: data?.cartCreate?.cart,
    userErrors: data?.userErrors,
  });
}
