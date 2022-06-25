export const getID = (shopifyId: string) => {
  const explode_id = shopifyId.split("/");
  return explode_id[explode_id.length - 1];
};

export const constructProductId = (id: number | string) => {
  return `gid://shopify/Product/${id}`;
};

export const constructCollectionId = (id: number | string) => {
  return `gid://shopify/Collection/${id}`;
};

export const constructCartId = (id: number | string) => {
  return `gid://shopify/Cart/${id}`;
};
