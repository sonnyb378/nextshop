import Image from 'next/image';
import React from 'react'
import Link from 'next/link';

import { getID } from '../utils/getID';
import ItemCard from './ItemCard';
import ImageContainer from './ImageContainer';

const FeaturedItem:React.FC<{items:any}> = ({ items}) => {
  // console.log("featured items: ", items);
  return (
    <div className='w-full flex flex-col items-center justify-between z-100'>

      <div className='flex items-center justify-between w-full h-16 p-5 bg-primary'>
        <div className='w-full'>
          <h2 className='text-white text-xl font-normal grow'>Featured Items</h2>
          {/* <div>
            <button className='px-6 py-2 bg-white text-black rounded-xl text-xs'>View All</button>
          </div> */}
        </div>

      </div>

      <div className="flex flex-col items-center justify-between w-full m-auto  md:flex-row ">
        <div className='flex flex-col w-full items-center justify-start mt-1/2 sm:flex-row'>
          {
            items && items.map((item: { node: any; }) => {
              const { node: {
                id, handle, description, images: {
                  edges: [{ node: { id: imgID, width: imgWidth, height: imgHeight, url: imgUrl}}]
                }, priceRange: {
                  maxVariantPrice: { amount: maxAmount, currencyCode: maxCurrencyCode },
                  minVariantPrice: { amount: minAmount, currencyCode: minCurrencyCode },
                }, title
              } } = item;
              const amountToDisplay = minAmount === maxAmount ? `${parseFloat(maxAmount).toFixed(2)}` : `+${parseFloat(minAmount).toFixed(2)}`

              const productID = getID(id);
              return (
                <ItemCard 
                  key={productID}
                  id={id}
                  title={title}
                  description={description}
                  minCurrencyCode={minCurrencyCode}
                  amountToDisplay={amountToDisplay}
                  productID={productID}
                  className={`flex flex-col items-center justify-between  h-96 ring-1 ring-gray-200 bg-white sm:w-1/3`}
                  ImgComponent={
                    <ImageContainer 
                      url={imgUrl} 
                      title={title} 
                      outerClass="flex flex-col flex-1 w-full items-center justify-center mb-2 bg-white"
                      layout="fill"
                      imageContainerClass="items-container w-[150px] relative" 
                      imageClass="!relative !w-full !h-[unset]"
                    />
                  }
                />
              )
            })
          }
        </div>
  

</div>
  
    </div>
  )
}

export default FeaturedItem