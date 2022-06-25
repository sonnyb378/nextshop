import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "../../../utils/apolloClient";
import { constructCartId } from "../../../utils/getID";
// get cart

type Data = {
  data: any;
};

const GET_CART = gql`
  query cart($id: ID!) {
    cart(id: $id) {
      id
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 10) {
        edges {
          node {
            id
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
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  // console.log("cartId: ", constructCartId(String(id)));
  const { data } = await client.query({
    query: GET_CART,
    variables: {
      id: constructCartId(String(id)),
    },
  });
  // console.log(data);
  res.status(200).json({ data: data?.cart });
}
