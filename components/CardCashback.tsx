import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/outline'

import cardcashback from "../assets/images/cardcashback.png"
import Image from 'next/image'

const CardCashback = () => {
  return (
    <div className='bg-primary flex items-center justify-between w-full h-44 mt-8 p-5'>
      <div className='flex flex-center justify-center m-auto w-full md:w-[1000px]'>
        <div className='flex items-center justify-center w-full border-0 border-yellow-500 text-white h-28'>

          <div className='w-[220px] h-full relative border-0 border-red-500'>
            <div className='ml-auto pl-10 w-2/3 mr-2 h-full relative border-0 border-orange-500'>
              <Image 
                src={cardcashback}
                alt="LogoIpsum Card"
                layout="fill"
                className='object-contain'
              />
            </div>
            
          </div>
          <div className="flex flex-col items-start justify-center border-0 border-blue-500  h-full">
            <h2 className='text-[32px] leading-none '>Earn unlimited</h2>
            <h1 className="text-[#FFD28B] text-[32px] mt-1 mb-1 leading-none">15% CASHBACK</h1>
            <p>with LogoIpsum Card</p>
          </div>
        </div>

        <div className='flex flex-col text-white w-2/3 border-l-2 border-white p-3'>
          <div className='text-sm pr-10'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
  eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div className='flex items-center mt-3'>
            Learn more <ChevronRightIcon className='h-6'/>
          </div>
        </div>
      </div>
      

    </div>
  )
}

export default CardCashback