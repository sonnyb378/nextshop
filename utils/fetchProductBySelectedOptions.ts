import { constructSelectedOptions } from "./constructSelections";

import client from "./apolloClient";

export const fetchProductBySelectedOptions = async (
  selectedColor: any,
  selectedSize: any,
  selectedStyle: any,
  selectedMaterial: any,
  id: string
) => {
  const itemsAttributes = constructSelectedOptions(
    selectedColor,
    selectedSize,
    selectedStyle,
    selectedMaterial,
    "name"
  );

  // console.log(itemsAttributes);
  const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products/variant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: id,
      options: itemsAttributes,
    }),
  });
  const result = await response.json();

  if (response.ok) {
    return result?.product?.variantBySelectedOptions;
  }
};
