import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { getID } from '../utils/getID';

const TodaysDeal:React.FC<{deal?:any}> = ({deal}) => {
  
  const { maxVariantPrice, minVariantPrice} = deal.priceRange;
  // console.log( parseFloat(minVariantPrice.amount).toFixed(2) );

  const amountToDisplay = `${minVariantPrice.currencyCode} ${ minVariantPrice.amount == maxVariantPrice.amount ? `${parseFloat(maxVariantPrice.amount).toFixed(2)}` : `${parseFloat(minVariantPrice.amount).toFixed(2)}` }`

  return (
    <div className='flex flex-col items-start justify-center rounded-xl w-full border-2 border-gray-400 p-3 bg-black z-1000 relative'>
      <span className='text-yellow-400 text-lg mb-5'>Today&apos;s Deal</span>
      <div className='items-container relative'>
        <Image
          src={deal.images.edges[0].node.url}
          alt={deal.title}
          layout="fill"
          className='!relative !w-full !h-[unset]'
        />
      </div>
      <div className='flex items-center justify-between w-full text-white mt-4'>
        <div className='truncate pr-2 '>
          { deal.title}
        </div>
        <div className='flex items-center justify-end text-orange-400 text-sm w-1/2 md:text-base '>
          { amountToDisplay }
        </div>
      </div>
      <div className='text-gray-400 text-[10px] mb-5 h-12 overflow-hidden text-ellipsis'>
        {deal.description}
      </div>
      <Link href={`/products/${getID(deal.id)}`}>
        <div className='flex items-center justify-center border-2 border-textPrimary rounded-lg m-auto px-10 py-2 bg-textPrimary cursor-pointer mb-3 group'>        
          <button className='text-sm text-white group-hover:text-yellow-500'>Buy Now</button>
        </div>
      </Link>
      
    </div>
  )
}

export default TodaysDeal;
