import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";
import { gql } from "@apollo/client";

type Data = {
  data: any;
};

const GET_SHOP_CATEGORIES = gql`
  query getAllShopCategories {
    collections(first: 8, query: "(-title:'Featured Items') AND (-title:'Deal of the Day')") {
      edges {
        node {
          id
          title
          handle
          image {
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
  const { data } = await client.query({
    query: GET_SHOP_CATEGORIES,
  });

  res.status(200).json({ data: data });
}
