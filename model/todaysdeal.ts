export const fakeTodaysDeal = {
  data: {
    collection: {
      __typename: "Collection",
      id: "gid://shopify/Collection/279945117902",
      title: "Deal of the Day",
      handle: "todays-deal",
      description: "",
      products: {
        __typename: "ProductConnection",
        edges: [
          {
            __typename: "ProductEdge",
            node: {
              __typename: "Product",
              id: "gid://shopify/Product/7018015654094",
              title: "MacBook Pro - 13-Inch",
              handle: "macbook-pro-13-inch",
              description:
                "The Apple M1 chip gives the 13‑inch MacBook Pro speed and power beyond belief. With up to 2.8x CPU performance. Up to 5x the graphics speed. An advanced Neural Engine for up to 11x faster machine learning. And up to 20 hours of battery life so you can go all day. It’s our most popular pro notebook, taken to a whole new level.",
              priceRange: {
                __typename: "ProductPriceRange",
                minVariantPrice: {
                  __typename: "MoneyV2",
                  amount: "1299.0",
                  currencyCode: "USD",
                },
                maxVariantPrice: {
                  __typename: "MoneyV2",
                  amount: "1299.0",
                  currencyCode: "USD",
                },
              },
              images: {
                __typename: "ImageConnection",
                edges: [
                  {
                    __typename: "ImageEdge",
                    node: {
                      __typename: "Image",
                      id: "gid://shopify/ProductImage/31079394476238",
                      url: "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/macbook-pro-13.jpg?v=1654219687",
                      width: 2416,
                      height: 1196,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
  loading: false,
  networkStatus: 7,
};
