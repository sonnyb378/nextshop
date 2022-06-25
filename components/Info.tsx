import React from 'react'
import { info } from '../model/info'
import { QuestionMarkCircleIcon, CreditCardIcon, TruckIcon } from "@heroicons/react/outline"

const Info = () => {
  return (
    <div className='flex items-center justify-center px-10'>
      <div className='flex items-center justify-center w-full border-0 border-green-500 md:w-[1000px]'>

      {
        info && info.data.map((i) => {
          const { Icon } = i;
          // console.log(Icon);
          return (
            <div key={i.title} className="w-1/3 ring-0 ring-gray-500 p-2">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#DEDEDE] h-44 p-5 text-textPrimary">
                  <Icon className='text-xl'/>
                  <div className='font-bold text-md'>{i.title}</div>
                  <div className='flex items-center justify-center text-[10px] text-center text-gray-500'>
                    {i.description}
                  </div>
                  <div className='text-sm underline mt-1 cursor-pointer hover:text-accentDark'>Learn more</div>
                </div>
            </div>
          )
        })
      }
        

      </div>
    
    </div>
  )
}

export default Info
