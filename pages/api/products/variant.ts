import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";

type Data = {
  product: any;
};

const GET_PRODUCT_BY_SELECTED_OPTIONS = gql`
  query getProductBySelectedOptions($id: ID!, $variants: [SelectedOptionInput!]!) {
    product(id: $id) {
      id
      title
      handle
      description
      variantBySelectedOptions(selectedOptions: $variants) {
        id
        title
        sku
        quantityAvailable
        priceV2 {
          amount
          currencyCode
        }
        image {
          url
          width
          height
        }
        selectedOptions {
          name
          value
        }
      }
      images(first: 10) {
        edges {
          node {
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
  const { productId, options } = req.body;

  // console.log(productId, options);

  const { data } = await client.query({
    query: GET_PRODUCT_BY_SELECTED_OPTIONS,
    variables: {
      id: productId,
      variants: options,
    },
  });
  res.status(200).json({ product: data?.product });
}
