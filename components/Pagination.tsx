import Link from 'next/link';
import React, { MouseEventHandler, useEffect } from 'react'

export interface PageInfo {
  previous: string | null;
  next: string | null;
}
export const productDisplayCount = 1;
export const pagesToDisplay = 5;

const Pagination:React.FC<{
  collection_id: string;
  productsCount: number,
  pages: PageInfo,
  onClickHandler: any
}> = ({collection_id, productsCount, pages, onClickHandler}) => {

  return (
    <div className="">
      {
        pages.previous || pages.next ?      
      <div className="w-full flex items-center justify-start mt-5 mb-10 border-0 border-red-500 space-x-5">
        {
          pages.previous ? 
            <button className={`flex items-center justify-center px-5 py-2 text-white text-sm  rounded-xl w-28 bg-primary cursor-pointer hover:text-orange-200`} onClick={onClickHandler.bind(this, pages.previous)} >Previous</button>
          :
          <button className={`flex items-center justify-center px-5 py-2 text-white text-sm  rounded-xl w-28 bg-gray-500 cursor-pointer`}  disabled >Previous</button>
        }
        {/* <div className='flex items-center justify-center space-x-1 ml-5 mr-5'>
          {
            numberOfPages && numberOfPages.map((num) => {
              // const highlight = currentCursor ?  : ""
              return <div key={num} className="flex items-center justify-center w-8 h-8 bg-white ring-1 ring-gray-300 cursor-pointer rounded-full  text-sm hover:bg-gray-100">{num}</div>
            })        
          }
        </div> */}
        {
          pages.next ?           
            <div className='flex items-center justify-center px-5 py-2 text-white text-sm bg-primary rounded-xl w-28 cursor-pointer hover:text-orange-200' onClick={onClickHandler.bind(this, pages.next)} >Next</div>
          :
            <button className={`flex items-center justify-center px-5 py-2 text-white text-sm  rounded-xl w-28 bg-gray-500 cursor-pointer`}  disabled >Next</button>
        }
      </div>
      : ""
      }
    </div>
  )
}

export default Pagination