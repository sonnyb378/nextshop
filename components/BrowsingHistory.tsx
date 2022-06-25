import { title } from 'process';
import React from 'react'
// import { Product } from '../app/store/slices/browsinghistory';
import { getID } from '../utils/getID';
import BrowsingHistoryCard from './BrowsingHistoryCard';
import ItemCard from './ItemCard';
import Image from 'next/image';

import ImageContainer from './ImageContainer';

import { IProduct } from '../ts/product';

const BrowsingHistory:React.FC<{history: any}> = ({ history}) => {

  // console.log("browsing history: ", history);
  return (
    <div className='p-10'>
      <div>
        <h1 className='leading-none font-bold text-2xl text-textPrimary'>
          Your Browsing History</h1>
      </div>
      <div id="scrollable" className='flex items-center justify-start mt-5 w-full overflow-auto scrollbar-hide space-x-[3px] p-2 border-0 border-red-500'>
        {
          history && history.map((item: IProduct) => {
            const productID = getID(item.id!);
            const { priceRange: {
              maxVariantPrice: { amount: maxAmount, currencyCode: maxCurrencyCode },
              minVariantPrice: { amount: minAmount, currencyCode: minCurrencyCode }
            } } = item;
            const amountToDisplay = minAmount === maxAmount ? `${parseFloat(maxAmount).toFixed(2)}` : `+${parseFloat(minAmount).toFixed(2)}`
            return (
              <ItemCard 
                key={productID}
                id={item.id!}
                // imgUrl={item.image?.url!}
                title={item.title!}
                description={item.description!}
                minCurrencyCode={minCurrencyCode!}
                amountToDisplay={amountToDisplay}
                productID={productID}
                className={`flex flex-col items-center justify-between w-[225px] h-96 ring-1 ring-gray-300 bg-white`}
                ImgComponent={<ImageContainer 
                  url={item.image?.url!} 
                  title={title} 
                  outerClass="flex flex-col flex-1 w-full items-center justify-center mb-2 bg-white overflow-hidden ring-1 ring-gray-300"
                  width={item.image?.width}
                  height={item.image?.height}
                  layout="responsive"
                  imageContainerClass="w-full relative" 
                  imageClass="object-cover"
                  />}                
                />
            )
          })
        }
      </div>
      
    </div>
  )
}

export default BrowsingHistory;
