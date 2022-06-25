import { ICartDataStruct } from "../ts/cart/interfaces/cart";

export const fakeCartItems = {
  data: {
    __typename: "Cart",
    id: "gid://shopify/Cart/350fe8ee4e7fbba55bf2e702ed14aa1f",
    estimatedCost: {
      __typename: "CartEstimatedCost",
      totalAmount: {
        __typename: "MoneyV2",
        amount: "184.0",
        currencyCode: "USD",
      },
      subtotalAmount: {
        __typename: "MoneyV2",
        amount: "184.0",
        currencyCode: "USD",
      },
      totalDutyAmount: null,
      totalTaxAmount: null,
    },
    lines: {
      __typename: "CartLineConnection",
      edges: [
        {
          __typename: "CartLineEdge",
          node: {
            __typename: "CartLine",
            id: "gid://shopify/CartLine/23dd6691588db155c7666e5aee8c7c2b?cart=350fe8ee4e7fbba55bf2e702ed14aa1f",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/41223194345678",
              title: "Large / Black-#000000 / Cotton",
              quantityAvailable: 10,
              image: {
                __typename: "Image",
                url: "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/blacktshirt.jpg?v=1653884922",
                width: 310,
                height: 163,
              },
              priceV2: {
                __typename: "MoneyV2",
                amount: "12.0",
                currencyCode: "USD",
              },
              product: {
                __typename: "Product",
                id: "gid://shopify/Product/7014874251470",
                title: "Men's Plain T-Shirt",
                description: "Plain black t-shirt",
              },
            },
            attributes: [
              {
                __typename: "Attribute",
                key: "Color",
                value: "Black-#000000",
              },
              {
                __typename: "Attribute",
                key: "Size",
                value: "Large",
              },
              {
                __typename: "Attribute",
                key: "Material",
                value: "Cotton",
              },
            ],
            estimatedCost: {
              __typename: "CartLineEstimatedCost",
              totalAmount: {
                __typename: "MoneyV2",
                amount: "24.0",
                currencyCode: "USD",
              },
              subtotalAmount: {
                __typename: "MoneyV2",
                amount: "24.0",
                currencyCode: "USD",
              },
            },
          },
        },
        {
          __typename: "CartLineEdge",
          node: {
            __typename: "CartLine",
            id: "gid://shopify/CartLine/4cb5fb41f8b80654e9c4817be1cecc6c?cart=350fe8ee4e7fbba55bf2e702ed14aa1f",
            quantity: 1,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/41223983399118",
              title: "Black/White-#000000-#ffffff / 9",
              quantityAvailable: 2,
              image: {
                __typename: "Image",
                url: "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/air-max-270-mens-shoes-KkLcGR_3.jpg?v=1653934920",
                width: 1728,
                height: 2160,
              },
              priceV2: {
                __typename: "MoneyV2",
                amount: "160.0",
                currencyCode: "USD",
              },
              product: {
                __typename: "Product",
                id: "gid://shopify/Product/7015033602254",
                title: "Nike Air Max 270",
                description:
                  "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
              },
            },
            attributes: [
              {
                __typename: "Attribute",
                key: "Color",
                value: "Black/White-#000000-#ffffff",
              },
              {
                __typename: "Attribute",
                key: "Size",
                value: "9",
              },
            ],
            estimatedCost: {
              __typename: "CartLineEstimatedCost",
              totalAmount: {
                __typename: "MoneyV2",
                amount: "160.0",
                currencyCode: "USD",
              },
              subtotalAmount: {
                __typename: "MoneyV2",
                amount: "160.0",
                currencyCode: "USD",
              },
            },
          },
        },
      ],
      pageInfo: {
        __typename: "PageInfo",
        endCursor:
          "eyJsYXN0X2lkIjoiNGNiNWZiNDFmOGI4MDY1NGU5YzQ4MTdiZTFjZWNjNmMiLCJsYXN0X3ZhbHVlIjoiNGNiNWZiNDFmOGI4MDY1NGU5YzQ4MTdiZTFjZWNjNmMifQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor:
          "eyJsYXN0X2lkIjoiMjNkZDY2OTE1ODhkYjE1NWM3NjY2ZTVhZWU4YzdjMmIiLCJsYXN0X3ZhbHVlIjoiMjNkZDY2OTE1ODhkYjE1NWM3NjY2ZTVhZWU4YzdjMmIifQ==",
      },
    },
  } as unknown as ICartDataStruct,
};
