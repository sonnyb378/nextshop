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

type CheckoutData = {
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

export const checkoutFieldsPartial = `
  checkout {
    id
    webUrl
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
  }
`;

const CHECKOUT_CREATE = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      ${checkoutFieldsPartial}
      checkoutUserErrors {
        code
        field
        message
      }
      queueToken
    }
  }
`;

const CHECKOUT_UPDATE_ATTRIBUTES = gql`
  mutation checkoutAttributesUpdateV2($checkoutId: ID!, $input: CheckoutAttributesUpdateV2Input!) {
    checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
      ${checkoutFieldsPartial}
      checkoutUserErrors {
        code, field, message
      }
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | CheckoutData>
) {
  const method = req.method;

  if (method === "POST") {
    const { inputVariables } = req.body;
    const inputVars = {
      input: inputVariables,
    };

    const { data, errors } = await client.mutate({
      mutation: CHECKOUT_CREATE,
      variables: inputVars,
    });
    res.status(200).json({
      checkout: data?.checkoutCreate.checkout,
      checkoutUserErrors: data?.checkoutCreate.checkoutUserErrors,
    });
  } else if (method === "PATCH") {
    // checkoutAttributesUpdateV2
    const { checkoutId, input } = req.body;
    const { data, errors } = await client.mutate({
      mutation: CHECKOUT_UPDATE_ATTRIBUTES,
      variables: {
        checkoutId,
        input,
      },
    });
    res.status(200).json({
      checkout: data?.checkoutAttributesUpdateV2.checkout,
      checkoutUserErrors: data?.checkoutAttributesUpdateV2.checkoutUserErrors,
    });
  }
}
