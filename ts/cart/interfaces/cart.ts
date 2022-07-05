import { IImageStruct } from "../../product/image_data";

interface AmountStruct {
  amount: string;
  currencyCode: string;
}

export interface ICartCost {
  subtotalAmount: AmountStruct | null;
  totalAmount: AmountStruct | null;
  totalDutyAmount: AmountStruct | null;
  totalTaxAmount: AmountStruct | null;
}

interface Attrs {
  key: string;
  value: string;
}

interface ProductStruct {
  id: string;
  title: string;
  description: string;
}
interface MerchandiseStruct {
  id: string;
  title: string;
  quantityAvailable: number;
  image: IImageStruct;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  product: ProductStruct;
}
export interface ILinesEdges {
  node: {
    id: string;
    attributes: [Attrs];
    estimatedCost: ICartCost;
    quantity: number;
    merchandise: MerchandiseStruct;
  };
}
interface LinesStruct {
  edges: [ILinesEdges] | null;
  pageInfo: {
    endCursor: string;
    startCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ICartDataStruct {
  id: string | null;
  estimatedCost: ICartCost | null;
  lines: LinesStruct | null;
}

export interface ICartState {
  cartId: string | null;
  itemsCount: number;
}

export interface ICheckoutLineEdges {
  node: {
    customAttributes: [Attrs];
    discountAllocations: any;
    id: string;
    quantity: number;
    title: string;
    unitPrice: any;
    variant: {
      id: string;
      image: IImageStruct;
      priceV2: AmountStruct;
      product: {
        id: string;
        title: string;
        description: string;
        priceRange: {
          maxVariantPrice: AmountStruct;
          minVariantPrice: AmountStruct;
        };
      };
      quantityAvailable: number;
      sku: string;
      selectedOptions: [
        {
          name: string;
          value: string;
        }
      ];
      title: string;
    };
  };
}

export interface ICheckout {
  id: string;
  webUrl: string;
  lineItems: {
    edges: [ICheckoutLineEdges];
  };
}
