import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";
import { constructProductId } from "../../../utils/getID";

type Data = {
  product: any;
};

const GET_PRODUCT_BY_ID = gql`
  query getProductsByID($id: ID!) {
    product(id: $id) {
      id
      title
      description
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
      images(first: 20) {
        edges {
          node {
            id
            width
            height
            url
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  const product_id = constructProductId(String(id));
  const { data } = await client.query({
    query: GET_PRODUCT_BY_ID,
    variables: {
      id: `${product_id}`,
    },
  });

  res.status(200).json({ product: data?.product });
}
