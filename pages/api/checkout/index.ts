import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../utils/apolloClient";

type CheckoutError = {
  code: string;
  field: string;
  message: string;
};

type Data = {
  checkout: any;
  checkoutUserErrors: [CheckoutError] | null;
};

export const checkoutFields = `checkout {
  appliedGiftCards {
    id
    amountUsedV2 {
      amount
      currencyCode
    }
    balanceV2 {
      amount
      currencyCode
    }
    lastCharacters
    presentmentAmountUsed {
      amount
      currencyCode
    }
  }
  availableShippingRates {
    ready
    shippingRates {
      handle
      title
      priceV2 {
        amount
        currencyCode
      }
    }
  }
  buyerIdentity {
    countryCode
  }
  completedAt
  createdAt
  currencyCode
  customAttributes {
    key
    value
  }
  email
  id
  lineItemsSubtotalPrice {
    amount
    currencyCode
  }
  note
  order {
    cancelReason
    canceledAt
    currencyCode
    currentSubtotalPrice {
      amount
      currencyCode
    }
    currentTotalDuties {
      amount
      currencyCode
    }
    currentTotalPrice {
      amount
      currencyCode
    }
    currentTotalTax {
      amount
      currencyCode
    }
    customerLocale
    customerUrl
    edited
    email
    financialStatus
    fulfillmentStatus
    id
    name
    orderNumber
    originalTotalDuties {
      amount
      currencyCode
    }
    originalTotalPrice {
      amount
      currencyCode
    }
    phone
    processedAt
    shippingAddress {
      id
      address1
      address2
      city
      province
      provinceCode
      zip
      country
      countryCodeV2
      latitude
      longitude
      firstName
      lastName
      phone
      formattedArea
      formatted
    }
    shippingDiscountAllocations {
      allocatedAmount {
        amount
        currencyCode
      }
      discountApplication {
        allocationMethod
        targetSelection
        targetType
        value {
          ... on MoneyV2 {
            amount
            currencyCode
          }
          ... on PricingPercentageValue {
            percentage
          }
        }
      }
    }
    statusUrl
    subtotalPriceV2 {
      amount
      currencyCode
    }
    successfulFulfillments {
      trackingCompany
      trackingInfo {
        number
        url
      }
    }
    totalPriceV2 {
      amount
      currencyCode
    }
    totalRefundedV2 {
      amount
      currencyCode
    }
    totalShippingPriceV2 {
      amount
      currencyCode
    }
    totalTaxV2 {
      amount
      currencyCode
    }
    lineItems(first: 10) {
      edges {
        node {
          currentQuantity
          customAttributes {
            key
            value
          }
          discountAllocations {
            allocatedAmount {
              amount
              currencyCode
            }
            discountApplication {
              allocationMethod
              targetType
              targetSelection
              value {
                ... on MoneyV2 {
                  amount
                  currencyCode
                }
                ... on PricingPercentageValue {
                  percentage
                }
              }
            }
          }
          discountedTotalPrice {
            amount
            currencyCode
          }
          originalTotalPrice {
            amount
            currencyCode
          }
          quantity
          title
          variant {
            id
            title
            image {
              id
              url
              height
              width
            }
            sku
            quantityAvailable
            priceV2 {
              amount
              currencyCode
            }
            product {
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
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
  orderStatusUrl
  paymentDueV2 {
    amount
    currencyCode
  }
  ready
  requiresShipping
  shippingAddress {
    id
    address1
    address2
    city
    province
    provinceCode
    zip
    country
    countryCodeV2
    latitude
    longitude
    firstName
    lastName
    phone
    formattedArea
    formatted
  }
  shippingDiscountAllocations {
    allocatedAmount {
      amount
      currencyCode
    }
    discountApplication {
      allocationMethod
      targetSelection
      targetType
      value {
        ... on MoneyV2 {
          amount
          currencyCode
        }
        ... on PricingPercentageValue {
          percentage
        }
      }
    }
  }
  shippingLine {
    title
    handle
    priceV2 {
      amount
      currencyCode
    }
  }
  subtotalPriceV2 {
    amount
    currencyCode
  }
  taxExempt
  taxesIncluded
  totalDuties {
    amount
    currencyCode
  }
  totalPriceV2 {
    amount
    currencyCode
  }
  totalTaxV2 {
    amount
    currencyCode
  }
  updatedAt
  webUrl
  discountApplications(first: 10) {
    edges {
      node {
        allocationMethod
        targetSelection
        targetType
        value {
          ... on MoneyV2 {
            amount
            currencyCode
          }
          ... on PricingPercentageValue {
            percentage
          }
        }
      }
    }
  }
  lineItems(first: 10) {
    edges {
      node {
        customAttributes {
          key
          value
        }
        discountAllocations {
          allocatedAmount {
            amount
            currencyCode
          }
          discountApplication {
            allocationMethod
            targetType
            targetSelection
            value {
              ... on MoneyV2 {
                amount
                currencyCode
              }
              ... on PricingPercentageValue {
                percentage
              }
            }
          }
        }
        id
        quantity
        title
        unitPrice {
          amount
          currencyCode
        }
        variant {
          id
          title
          image {
            id
            url
            height
            width
          }
          sku
          quantityAvailable
          priceV2 {
            amount
            currencyCode
          }
          product {
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
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}`;

const CHECKOUT_CREATE = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      ${checkoutFields}
      checkoutUserErrors {
        code
        field
        message
      }
      queueToken
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const method = req.method;

  const { inputVariables, queueToken } = req.body;
  const inputVars = {
    input: inputVariables,
    queueToken: queueToken,
  };

  const { data, errors } = await client.mutate({
    mutation: CHECKOUT_CREATE,
    variables: inputVars,
  });
  res.status(200).json({
    checkout: data?.checkoutCreate.checkout,
    checkoutUserErrors: data?.checkoutCreate.checkoutUserErrors,
  });
}

// {
//   "checkout": {
//       "appliedGiftCards": [],
//       "availableShippingRates": {
//           "ready": true,
//           "shippingRates": null,
//           "__typename": "AvailableShippingRates"
//       },
//       "buyerIdentity": {
//           "countryCode": "US",
//           "__typename": "CheckoutBuyerIdentity"
//       },
//       "completedAt": null,
//       "createdAt": "2022-06-25T07:36:34Z",
//       "currencyCode": "USD",
//       "customAttributes": [],
//       "email": null,
//       "id": "gid://shopify/Checkout/7acc8bf0813cd9f3f6dbe51370f1591c?key=ef382916349e55fa5d6599bf2e3de355",
//       "lineItemsSubtotalPrice": {
//           "amount": "184.0",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "note": null,
//       "order": null,
//       "orderStatusUrl": null,
//       "paymentDueV2": {
//           "amount": "184.0",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "ready": false,
//       "requiresShipping": true,
//       "shippingAddress": {
//           "id": "gid://shopify/MailingAddress/9461638365390?model_name=Address",
//           "address1": "7970 woodman ave",
//           "address2": "",
//           "city": "panorama city",
//           "province": "California",
//           "provinceCode": "CA",
//           "zip": "91402",
//           "country": "United States",
//           "countryCodeV2": "US",
//           "latitude": null,
//           "longitude": null,
//           "firstName": "Sonny",
//           "lastName": "Baga3",
//           "phone": "",
//           "formattedArea": "panorama city CA, United States",
//           "formatted": [
//               "7970 woodman ave",
//               "panorama city CA 91402",
//               "United States"
//           ],
//           "__typename": "MailingAddress"
//       },
//       "shippingDiscountAllocations": [],
//       "shippingLine": null,
//       "subtotalPriceV2": {
//           "amount": "184.0",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "taxExempt": false,
//       "taxesIncluded": true,
//       "totalDuties": null,
//       "totalPriceV2": {
//           "amount": "184.0",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "totalTaxV2": {
//           "amount": "15.96",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "updatedAt": "2022-06-25T07:36:34Z",
//       "webUrl": "https://sbnextshop.myshopify.com/61819584718/checkouts/7acc8bf0813cd9f3f6dbe51370f1591c?key=ef382916349e55fa5d6599bf2e3de355",
//       "discountApplications": {
//           "edges": [],
//           "__typename": "DiscountApplicationConnection"
//       },
//       "lineItems": {
//           "edges": [
//               {
//                   "node": {
//                       "customAttributes": [
//                           {
//                               "key": "Color",
//                               "value": "Black-#000000",
//                               "__typename": "Attribute"
//                           },
//                           {
//                               "key": "Size",
//                               "value": "Large",
//                               "__typename": "Attribute"
//                           },
//                           {
//                               "key": "Material",
//                               "value": "Cotton",
//                               "__typename": "Attribute"
//                           }
//                       ],
//                       "discountAllocations": [],
//                       "id": "gid://shopify/CheckoutLineItem/412231943456780?checkout=7acc8bf0813cd9f3f6dbe51370f1591c",
//                       "quantity": 2,
//                       "title": "Men's Plain T-Shirt",
//                       "unitPrice": null,
//                       "variant": {
//                           "id": "gid://shopify/ProductVariant/41223194345678",
//                           "title": "Large / Black-#000000 / Cotton",
//                           "image": {
//                               "id": "gid://shopify/ProductImage/31034804437198",
//                               "url": "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/blacktshirt.jpg?v=1653884922",
//                               "height": 163,
//                               "width": 310,
//                               "__typename": "Image"
//                           },
//                           "sku": "TS0013",
//                           "quantityAvailable": 10,
//                           "priceV2": {
//                               "amount": "12.0",
//                               "currencyCode": "USD",
//                               "__typename": "MoneyV2"
//                           },
//                           "product": {
//                               "id": "gid://shopify/Product/7014874251470",
//                               "title": "Men's Plain T-Shirt",
//                               "description": "Plain black t-shirt",
//                               "priceRange": {
//                                   "minVariantPrice": {
//                                       "amount": "12.0",
//                                       "currencyCode": "USD",
//                                       "__typename": "MoneyV2"
//                                   },
//                                   "maxVariantPrice": {
//                                       "amount": "18.0",
//                                       "currencyCode": "USD",
//                                       "__typename": "MoneyV2"
//                                   },
//                                   "__typename": "ProductPriceRange"
//                               },
//                               "__typename": "Product"
//                           },
//                           "selectedOptions": [
//                               {
//                                   "name": "Size",
//                                   "value": "Large",
//                                   "__typename": "SelectedOption"
//                               },
//                               {
//                                   "name": "Color",
//                                   "value": "Black-#000000",
//                                   "__typename": "SelectedOption"
//                               },
//                               {
//                                   "name": "Material",
//                                   "value": "Cotton",
//                                   "__typename": "SelectedOption"
//                               }
//                           ],
//                           "__typename": "ProductVariant"
//                       },
//                       "__typename": "CheckoutLineItem"
//                   },
//                   "__typename": "CheckoutLineItemEdge"
//               },
//               {
//                   "node": {
//                       "customAttributes": [
//                           {
//                               "key": "Color",
//                               "value": "Black/White-#000000-#ffffff",
//                               "__typename": "Attribute"
//                           },
//                           {
//                               "key": "Size",
//                               "value": "9",
//                               "__typename": "Attribute"
//                           }
//                       ],
//                       "discountAllocations": [],
//                       "id": "gid://shopify/CheckoutLineItem/412239833991180?checkout=7acc8bf0813cd9f3f6dbe51370f1591c",
//                       "quantity": 1,
//                       "title": "Nike Air Max 270",
//                       "unitPrice": null,
//                       "variant": {
//                           "id": "gid://shopify/ProductVariant/41223983399118",
//                           "title": "Black/White-#000000-#ffffff / 9",
//                           "image": {
//                               "id": "gid://shopify/ProductImage/31038682300622",
//                               "url": "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/air-max-270-mens-shoes-KkLcGR_3.jpg?v=1653934920",
//                               "height": 2160,
//                               "width": 1728,
//                               "__typename": "Image"
//                           },
//                           "sku": "",
//                           "quantityAvailable": 2,
//                           "priceV2": {
//                               "amount": "160.0",
//                               "currencyCode": "USD",
//                               "__typename": "MoneyV2"
//                           },
//                           "product": {
//                               "id": "gid://shopify/Product/7015033602254",
//                               "title": "Nike Air Max 270",
//                               "description": "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
//                               "priceRange": {
//                                   "minVariantPrice": {
//                                       "amount": "160.0",
//                                       "currencyCode": "USD",
//                                       "__typename": "MoneyV2"
//                                   },
//                                   "maxVariantPrice": {
//                                       "amount": "160.0",
//                                       "currencyCode": "USD",
//                                       "__typename": "MoneyV2"
//                                   },
//                                   "__typename": "ProductPriceRange"
//                               },
//                               "__typename": "Product"
//                           },
//                           "selectedOptions": [
//                               {
//                                   "name": "Color",
//                                   "value": "Black/White-#000000-#ffffff",
//                                   "__typename": "SelectedOption"
//                               },
//                               {
//                                   "name": "Size",
//                                   "value": "9",
//                                   "__typename": "SelectedOption"
//                               }
//                           ],
//                           "__typename": "ProductVariant"
//                       },
//                       "__typename": "CheckoutLineItem"
//                   },
//                   "__typename": "CheckoutLineItemEdge"
//               }
//           ],
//           "__typename": "CheckoutLineItemConnection"
//       },
//       "__typename": "Checkout"
//   },
//   "checkoutUserErrors": []
// }

// {
//   "data": {
//     "checkoutCreate": {
//       "checkout": {
//         "appliedGiftCards": [],
//         "availableShippingRates": null,
//         "buyerIdentity": {
//           "countryCode": null
//         },
//         "completedAt": null,
//         "createdAt": "2022-06-21T01:20:32Z",
//         "currencyCode": "USD",
//         "customAttributes": [],
//         "email": null,
//         "id": "gid://shopify/Checkout/3404627bdd902a61915fc02bf6e3221b?key=ea6cf86e7a36c8d262054890717a1b6f",
//         "lineItemsSubtotalPrice": {
//           "amount": "184.0",
//           "currencyCode": "USD"
//         },
//         "note": null,
//         "order": null,
//         "orderStatusUrl": null,
//         "paymentDueV2": {
//           "amount": "184.0",
//           "currencyCode": "USD"
//         },
//         "ready": true,
//         "requiresShipping": true,
//         "shippingAddress": null,
//         "shippingDiscountAllocations": [],
//         "shippingLine": null,
//         "subtotalPriceV2": {
//           "amount": "184.0",
//           "currencyCode": "USD"
//         },
//         "taxExempt": false,
//         "taxesIncluded": true,
//         "totalDuties": null,
//         "totalPriceV2": {
//           "amount": "184.0",
//           "currencyCode": "USD"
//         },
//         "totalTaxV2": {
//           "amount": "0.0",
//           "currencyCode": "USD"
//         },
//         "updatedAt": "2022-06-21T01:20:32Z",
//         "webUrl": "https://sbnextshop.myshopify.com/61819584718/checkouts/3404627bdd902a61915fc02bf6e3221b?key=ea6cf86e7a36c8d262054890717a1b6f",
//         "discountApplications": {
//           "edges": []
//         },
//         "lineItems": {
//           "edges": [
//             {
//               "node": {
//                 "customAttributes": [
//                   {
//                     "key": "Color",
//                     "value": "Black-#000000"
//                   },
//                   {
//                     "key": "Size",
//                     "value": "Large"
//                   },
//                   {
//                     "key": "Material",
//                     "value": "Cotton"
//                   }
//                 ],
//                 "discountAllocations": [],
//                 "id": "gid://shopify/CheckoutLineItem/412231943456780?checkout=3404627bdd902a61915fc02bf6e3221b",
//                 "quantity": 2,
//                 "title": "Men's Plain T-Shirt",
//                 "unitPrice": null,
//                 "variant": {
//                   "id": "gid://shopify/ProductVariant/41223194345678",
//                   "title": "Large / Black-#000000 / Cotton",
//                   "image": {
//                     "id": "gid://shopify/ProductImage/31034804437198",
//                     "url": "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/blacktshirt.jpg?v=1653884922",
//                     "height": 163,
//                     "width": 310
//                   },
//                   "sku": "TS0013",
//                   "quantityAvailable": null,
//                   "priceV2": {
//                     "amount": "12.0",
//                     "currencyCode": "USD"
//                   },
//                   "product": {
//                     "id": "gid://shopify/Product/7014874251470",
//                     "title": "Men's Plain T-Shirt",
//                     "description": "Plain black t-shirt",
//                     "priceRange": {
//                       "minVariantPrice": {
//                         "amount": "12.0",
//                         "currencyCode": "USD"
//                       },
//                       "maxVariantPrice": {
//                         "amount": "18.0",
//                         "currencyCode": "USD"
//                       }
//                     }
//                   },
//                   "selectedOptions": [
//                     {
//                       "name": "Size",
//                       "value": "Large"
//                     },
//                     {
//                       "name": "Color",
//                       "value": "Black-#000000"
//                     },
//                     {
//                       "name": "Material",
//                       "value": "Cotton"
//                     }
//                   ]
//                 }
//               }
//             },
//             {
//               "node": {
//                 "customAttributes": [
//                   {
//                     "key": "Color",
//                     "value": "Black/White-#000000-#ffffff"
//                   },
//                   {
//                     "key": "Size",
//                     "value": "9"
//                   }
//                 ],
//                 "discountAllocations": [],
//                 "id": "gid://shopify/CheckoutLineItem/412239833991180?checkout=3404627bdd902a61915fc02bf6e3221b",
//                 "quantity": 1,
//                 "title": "Nike Air Max 270",
//                 "unitPrice": null,
//                 "variant": {
//                   "id": "gid://shopify/ProductVariant/41223983399118",
//                   "title": "Black/White-#000000-#ffffff / 9",
//                   "image": {
//                     "id": "gid://shopify/ProductImage/31038682300622",
//                     "url": "https://cdn.shopify.com/s/files/1/0618/1958/4718/products/air-max-270-mens-shoes-KkLcGR_3.jpg?v=1653934920",
//                     "height": 2160,
//                     "width": 1728
//                   },
//                   "sku": "",
//                   "quantityAvailable": null,
//                   "priceV2": {
//                     "amount": "160.0",
//                     "currencyCode": "USD"
//                   },
//                   "product": {
//                     "id": "gid://shopify/Product/7015033602254",
//                     "title": "Nike Air Max 270",
//                     "description": "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
//                     "priceRange": {
//                       "minVariantPrice": {
//                         "amount": "160.0",
//                         "currencyCode": "USD"
//                       },
//                       "maxVariantPrice": {
//                         "amount": "160.0",
//                         "currencyCode": "USD"
//                       }
//                     }
//                   },
//                   "selectedOptions": [
//                     {
//                       "name": "Color",
//                       "value": "Black/White-#000000-#ffffff"
//                     },
//                     {
//                       "name": "Size",
//                       "value": "9"
//                     }
//                   ]
//                 }
//               }
//             }
//           ]
//         }
//       },
//       "checkoutUserErrors": [],
//       "queueToken": null
//     }
//   },
//   "errors": [
//     {
//       "message": "Shipping address can't be blank",
//       "locations": [
//         {
//           "line": 20,
//           "column": 9
//         }
//       ],
//       "path": [
//         "checkoutCreate",
//         "checkout",
//         "availableShippingRates"
//       ]
//     },
//     {
//       "message": "Access denied for quantityAvailable field. Required access: `unauthenticated_read_product_inventory` access scope.",
//       "locations": [
//         {
//           "line": 365,
//           "column": 19
//         }
//       ],
//       "path": [
//         "checkoutCreate",
//         "checkout",
//         "lineItems",
//         "edges",
//         0,
//         "node",
//         "variant",
//         "quantityAvailable"
//       ],
//       "extensions": {
//         "code": "ACCESS_DENIED",
//         "documentation": "https://shopify.dev/api/usage/access-scopes",
//         "requiredAccess": "`unauthenticated_read_product_inventory` access scope."
//       }
//     },
//     {
//       "message": "Access denied for quantityAvailable field. Required access: `unauthenticated_read_product_inventory` access scope.",
//       "locations": [
//         {
//           "line": 365,
//           "column": 19
//         }
//       ],
//       "path": [
//         "checkoutCreate",
//         "checkout",
//         "lineItems",
//         "edges",
//         1,
//         "node",
//         "variant",
//         "quantityAvailable"
//       ],
//       "extensions": {
//         "code": "ACCESS_DENIED",
//         "documentation": "https://shopify.dev/api/usage/access-scopes",
//         "requiredAccess": "`unauthenticated_read_product_inventory` access scope."
//       }
//     }
//   ]
// }
