import React from 'react'
import Image from 'next/image'

import { IProduct } from '../ts/product'

const BrowsingHistoryCard:React.FC<{item: IProduct}> = ({item}) => {
  // console.log("bh card: ", item)
  return (
    <div className='ring-1 ring-gray-400 flex flex-col items-center justify-between w-1/4 h-64'>
      <div className='relative w-full h-52'>
        <Image 
          src={item.image?.url!}
          alt={item.title!}
          width={item.image?.width}
          height={item.image?.height}
          layout="fill"
          className='object-cover'
        />
      </div>
      <div className='flex items-center justify-between w-full h-22 text-xs border-0 border-red-500 bg-white p-2 ring-1 ring-gray-400'>
        <div className='truncate w-1/2  border-0 border-red-500'>
          { item.title}
        </div>
        <div className='flex justify-end w-1/2  border-0 border-red-500'>
          amount
        </div>
      </div>

    </div>
  )
}

export default BrowsingHistoryCard