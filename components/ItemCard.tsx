import React, { ComponentProps, FunctionComponent, JSXElementConstructor } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import ImageContainer from './ImageContainer'
import { getID } from '../utils/getID'

import { IItemCardProps } from '../ts/product/item_card'
// interface ItemCardProps {
//   id:string,
//   title: string,
//   minCurrencyCode: string
//   amountToDisplay: string,
//   description: string,
//   productID: string,
//   className?: string
//   ImgComponent?: React.ReactNode
// }

const ItemCard:React.FC<IItemCardProps> = (props) => {
  const {id, title, minCurrencyCode, amountToDisplay, description, productID, className, ImgComponent } = props

  return (
    
    <div key={id} className={className}>
        
      { ImgComponent}              
      
      <div className="flex flex-col items-center justify-center p-3 w-full">
        <div className="w-full flex items-center justify-between text-xs mb-1">
          <span className='truncate grow font-bold text-md text-textPrimary'>{title}</span>
          <span className='min-w-[100px] flex items-center justify-end font-bold text-orange-800'>{minCurrencyCode}{" "}{ amountToDisplay }</span>                
        </div>
        <div className='flex item-start w-full text-[10px] h-[45px] text-ellipsis overflow-hidden text-gray-500'>
          { description }
        </div>
        
        <Link href={`/products/${productID}`}>
            <div className="flex items-center justify-center p-2 text-sm bg-textPrimary w-full rounded-2xl text-white mt-3 cursor-pointer hover:text-yellow-500">
              view
            </div>
          </Link>
      </div>
      
    </div>
  
  )
}

export default ItemCard