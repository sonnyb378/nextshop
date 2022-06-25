import { gql } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../utils/apolloClient";
import { checkoutFields } from "../index";

type CheckoutError = {
  code: string;
  field: string;
  message: string;
};

type Data = {
  checkout: any;
  checkoutUserErrors: [CheckoutError] | null;
};

const UPDATE_CHECKOUT_SHIPPING_ADDRESS = gql`
mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
  checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
    ${checkoutFields}
    checkoutUserErrors {
      code
      field
      message
    }
  }
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { checkoutId, shippingAddress } = req.body;
  const { data, errors } = await client.mutate({
    mutation: UPDATE_CHECKOUT_SHIPPING_ADDRESS,
    variables: {
      checkoutId,
      shippingAddress,
    },
  });
  res.status(200).json({
    checkout: data?.checkoutShippingAddressUpdateV2.checkout,
    checkoutUserErrors: data?.checkoutShippingAddressUpdateV2.checkoutUserErrors,
  });
}
// {
//   "checkout": {
//       "appliedGiftCards": [],
//       "availableShippingRates": {
//           "ready": true,
//           "shippingRates": [
//               {
//                   "handle": "shopify-Economy-0.00",
//                   "title": "Economy",
//                   "priceV2": {
//                       "amount": "0.0",
//                       "currencyCode": "USD",
//                       "__typename": "MoneyV2"
//                   },
//                   "__typename": "ShippingRate"
//               },
//               {
//                   "handle": "shopify-Standard-6.90",
//                   "title": "Standard",
//                   "priceV2": {
//                       "amount": "6.9",
//                       "currencyCode": "USD",
//                       "__typename": "MoneyV2"
//                   },
//                   "__typename": "ShippingRate"
//               }
//           ],
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
//           "address1": "50 broad st",
//           "address2": "",
//           "city": "new york",
//           "province": "New York",
//           "provinceCode": "NY",
//           "zip": "10004",
//           "country": "United States",
//           "countryCodeV2": "US",
//           "latitude": 40.7056608,
//           "longitude": -74.01190310000001,
//           "firstName": "sonny",
//           "lastName": "baga",
//           "phone": "",
//           "formattedArea": "new york NY, United States",
//           "formatted": [
//               "50 broad st",
//               "new york NY 10004",
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
//           "amount": "0.0",
//           "currencyCode": "USD",
//           "__typename": "MoneyV2"
//       },
//       "updatedAt": "2022-06-25T08:44:36Z",
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
