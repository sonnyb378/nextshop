import type { NextApiRequest, NextApiResponse } from "next";

type ImageData = {
  created_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
};

type CollectionData = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  image: ImageData;
  products_count: number;
  admin_graphql_api_id: string;
};
type Data = {
  collection: CollectionData;
};

// type Data = {
//   name: string;
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { collectionID, apiVersion } = req.body;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/collections/${collectionID}.json?api_version=${apiVersion}&fields=id,title,handle,body_html, image, products_count,admin_graphql_api_id`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN,
      } as HeadersInit,
    }
  );

  const { collection } = await response.json();

  if (response.ok) {
    res.status(200).json({
      collection,
    });
  } else {
    const error = new Error("Error: API call");
    return Promise.reject(error);
  }
}
