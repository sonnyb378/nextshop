import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";
import { gql } from "@apollo/client";

type Data = {
  data: any;
};

const GET_FEATURED_ITEM = gql`
  query getFeaturedItem($id: ID!) {
    collection(id: $id) {
      id
      title
      handle
      products(first: 3) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.body;
  const { data } = await client.query({
    query: GET_FEATURED_ITEM,
    variables: {
      id: id,
    },
  });
  res.status(200).json({ data: data });
}
