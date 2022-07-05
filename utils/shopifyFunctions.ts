import { ICartDataStruct } from "../ts/cart/interfaces/cart";

export class ShopifyFunctions {
  checkoutCreate = async (inputVars: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputVariables: inputVars,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutLineItemsAdd = async (checkoutId: string, lineItems: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/lines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId: checkoutId,
        lineItems: {
          customAttributes: lineItems.customAttributes,
          quantity: lineItems.quantity,
          variantId: lineItems.variantId,
        },
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutLineItemsUpdate = async (checkoutId: string, lineItems: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/lines`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId,
        lineItems,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutLineItemsRemove = async (checkoutId: string, lineItemIds: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/lines`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId,
        lineItemIds,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutAttributesUpdateV2 = async (checkoutId: string, input: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId,
        input,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutShippingAddressUpdateV2 = async (checkoutId: string, shippingAddress: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId,
        shippingAddress,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  checkoutEmailUpdateV2 = async (checkoutId: string | null, email: string | null) => {
    // console.log("shopify functions: ", checkoutId, email);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkoutId,
        email,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  // checkoutCompleteWithTokenizedPaymentV3

  // customer
  customer = async (accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer/${accessToken}`);
    const result = await response.json();
    return { response, result };
  };

  // address
  customerAddressCreate = async (address: any, accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/address`, {
      method: "POST",
      body: JSON.stringify({
        address,
        accessToken,
      }),
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
    const result = await response.json();
    return { response, result };
  };

  // cart
  cartCreate = async (cartCreateInputVariables: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartVariables: cartCreateInputVariables,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  cartLinesAdd = async (cartLinesAddInputVariables: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/line`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartVariables: cartLinesAddInputVariables,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  cartLinesUpdate = async (variables: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/line`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables: variables,
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  cartLinesRemove = async (cartId: string, lineIds: [any]) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/line`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables: {
          cartId: cartId,
          lineIds,
        },
      }),
    });
    const result = await response.json();
    return { response, result };
  };

  getCheckoutLineId = async (checkoutData: any, variant_id: string) => {
    const checkoutLineId =
      checkoutData?.lineItems?.edges &&
      checkoutData?.lineItems?.edges.find((checkoutLineItem: any) => {
        return checkoutLineItem.node.variant.id === variant_id;
      });
    return checkoutLineId ? checkoutLineId : null;
  };

  // payment
  paymentStripe = async (cnumber: string, cexpdate: number, cexpyear: number, ccvc: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/payment/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_number: cnumber,
        card_exp_date: cexpdate,
        card_exp_year: cexpyear,
        card_cvc: ccvc,
      }),
    });
    const result = await response.json();
    return { response, result };
  };
}
