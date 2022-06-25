export interface IItemCardProps {
  id: string;
  title: string;
  minCurrencyCode: string;
  amountToDisplay: string;
  description: string;
  productID: string;
  className?: string;
  ImgComponent?: React.ReactNode;
}
