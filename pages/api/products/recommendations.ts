import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";
import { constructProductId } from "../../../utils/getID";

type Data = {
  recommendations: any;
};

const GET_RECOMMENDATIONS = gql`
  query getRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
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
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { productId } = req.body;
  // console.log(productId);
  const product_id = constructProductId(String(productId));
  const { data } = await client.query({
    query: GET_RECOMMENDATIONS,
    variables: {
      productId: `${product_id}`,
    },
  });

  res.status(200).json({ recommendations: data?.productRecommendations });
}
