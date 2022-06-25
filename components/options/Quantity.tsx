import React from 'react'

const Quantity:React.FC<{refQty:any}> = ({refQty}) => {
  // console.log("SIZE: ", sizeSelected, value);
  return (    
    <div className='h-full border-0 border-black mt-5'>      
      <label htmlFor="qty" className="flex items-center text-sm">
        <span className="mr-2 text-lg">Qty:</span>

        <input ref={refQty} id="qty" type="number" name="qty" min={1} step={1} defaultValue={1} max={99} maxLength={2} className="border-transparent ring-1 ring-gray-400 rounded-xl focus:border-transparent 
        focus:ring-2 focus:ring-sky-700 " required/>

      </label>
    </div>
    
  )
}

export default Quantity