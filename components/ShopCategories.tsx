import React from 'react'
import ShopCategoriesCard from './ShopCategoriesCard'
import { IImageStruct } from '../ts/product/image_data';

interface ItemData {
  node: {
    handle: string;
    id: string;
    image: IImageStruct;
    title: string;
  }
}

const ShopCategories: React.FC<{items?: any}> = ({ items }) => {
  
  return (
    <div className='w-full border-0 border-red-500 p-10 m-auto'>
      <h1 className='text-textPrimary text-2xl font-bold'>Shop By Categories</h1>

        <div className='flex flex-col items-start justify-start w-full border-0 border-blue-500 p-2 
        md:flex-row flex-col-4 flex-wrap'>      
          {
            items && items.map((item:ItemData) => {
              const { node } = item;
              return (
                <ShopCategoriesCard key={node.id} data={node}/>
              )
            })
          }

        </div>

    </div>
    
  )
}

export default ShopCategories