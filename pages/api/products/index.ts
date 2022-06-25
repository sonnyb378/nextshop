import { NextApiRequest, NextApiResponse } from "next";

type ImageData = {
  id: number;
  product_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: [];
  admin_graphql_api_id: string;
};

type Options = {
  id: number;
  product_id: number;
  name: string;
  position: number;
};

type Product = {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  options: [Options];
  image: ImageData;
};

type Data = {
  products: [Product];
  headers: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { collectionID, apiVersion, limit, page_info, query } = req.body;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/products.json?limit=${limit}${query}`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN,
      } as HeadersInit,
    }
  );

  const { products } = await response.json();
  if (response.ok) {
    res.status(200).json({
      products,
      headers: response.headers.get("Link"),
    });
  } else {
    const error = new Error("Error: API call");
    return Promise.reject(error);
  }
}
