import Image from 'next/image'
import React from 'react'
import cs from "../assets/images/customerservice.png";
import stars from "../assets/images/stars.png";

function CustomerService() {
  return (
    <div className='grid items-center justify-between ring-1 ring-gray-200 bg-[#F6F6F6] text-black md:flex'>

      <div className='flex flex-col items-center justify-center w-full m-auto md:w-[1000px] md:flex-row md:items-end lg:items-center'>
        <div className='p-10 w-full md:w-2/3'>
          <p className='text-xl font-bold'>
          Lorem ipsum dolor sit amet, 
  consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt 
  ut labore et dolore magna aliqua.
          </p>
          <div className='items-container w-44 mt-5 relative'>
            <Image 
              src={stars}
              alt="5-star rating!"
              layout='fill'
              className='!relative !w-full !h-[unset]'
            />
          </div>
          <span className='text-sm'>Best customer service in the market!</span>
        </div>

        <div className="items-container grow relative w-full sm:mt-1 ">
            <Image 
              src={cs}
              alt="Award-winning customer service"
              layout='fill'
              className='!relative !w-full !h-[unset]'
            />
        </div>
      </div>
      


    </div>
  )
}

export default CustomerService