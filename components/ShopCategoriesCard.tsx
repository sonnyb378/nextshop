import React from 'react'
import Image from 'next/image';
// import { ImageData } from './ShopCategories';
import Link from 'next/link';

import { getID } from '../utils/getID';
import { IImageStruct } from '../ts/product/image_data'; 

const ShopCategoriesCard: React.FC<{data:{
  handle: string;
  id: string;
  image: IImageStruct;
  title: string;
}}> = ({ data}) => {

  const { id, handle, title, image: {
    id: imageId, url: imageUrl, width: imageWidth, height: imageHeight
  }} = data;
  
  return (
    <div className='flex flex-col items-center justify-between w-full rounded-lg p-2 m-1/2 h-72 border-0 border-green-500 md:w-1/4 '>
      
      <div className='flex items-end justify-center w-full bg-white rounded-2xl h-full p-0 ring-1 ring-gray-300'>
        <div className='relative w-full h-full border-0 border-blue-500 p-2 flex flex-col items-center justify-end'>
          <Image 
            src={imageUrl}
            alt={title}
            layout="fill"
            className="object-cover absolute rounded-2xl"
            
          />
          <Link href={`/categories/${getID(id)}`}>
            <div className='flex items-center justify-center w-full text-xs bg-textPrimary rounded-full py-2 px-5 text-white relative cursor-pointer hover:text-yellow-500 truncate'>
              { title}
            </div>
          </Link>
        </div>
        
        
      </div>
    
    </div>
  )
}

export default ShopCategoriesCard