import { IPriceRange } from "./price_range";
import { IImageStruct } from "./image_data";

export interface IProduct {
  id: string | null;
  title: string | null;
  description: string | null;
  priceRange: IPriceRange;
  image: IImageStruct | null;
}
