import React from 'react'
import TodaysDeal from './TodaysDeal';
import Image from 'next/image';
import heroimage from "../assets/images/heroimage-flag.png"

const HeroImage: React.FC<{deal?: any}> = ({deal}) => {
  return (
    <div className='bg-black h-[600px] flex items-center justify-between relative z-100'>

      <div className='flex items-center justify-end w-full h-full border-0 border-red-500 p-10 absolute z-10'>
        <Image 
          src={heroimage}
          alt="hero image"
          layout='fill'
          className='object-cover'
          priority={true}
        />
        
        <div className='flex items-center justify-between w-full md:w-[1000px] m-auto'>
          <div className='flex flex-col items-start justify-start w-full h-2/3 border-0 border-blue-500 mr-5 relative'>
            <div>
              <h1 className='text-white text-[44px] font-bold'>Memorial Day Offers</h1>
            </div>
            <div className='text-gray-400 mt-5'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
            <div className='bg-primary rounded-xl px-5 py-2 mt-10 group cursor-pointer'>
              <button className='text-white text-xs group-hover:text-yellow-500'>See all offers</button>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center w-[450px] h-2/3 border-0 border-blue-500">
            <TodaysDeal deal={deal} />
          </div>
        </div>
        
      </div>

      
    </div>
  )
}

export default HeroImage