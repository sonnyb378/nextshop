export interface IPriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string | null;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string | null;
  };
}
