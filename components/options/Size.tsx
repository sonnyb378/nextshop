import React from 'react'

const Size:React.FC<{value:string, id: number, title: string, sizeSelected:any, onChangeHandler:React.ChangeEventHandler}> = ({value, id, title, sizeSelected, onChangeHandler}) => {
  // console.log("SIZE: ", sizeSelected, value);
  return (    
    <div className='h-full border-0 border-black'>
      <input onChange={onChangeHandler} id={`size_radio${id}`} type="radio" name={`size_radio`} className="hidden" checked={sizeSelected===value} />
      <label htmlFor={`size_radio${id}`} className="flex items-center text-sm">
        <div className={` px-5 py-2 m-1 rounded-lg ring-1 ring-gray-300  
        ${sizeSelected === value ? "ring-sky-800 ring-2 bg-sky-800 text-white" : "bg-gray-200 border-slate-50 cursor-pointer hover:ring-2 hover:ring-primary hover:text-primary hover:bg-gray-300"}
        `}>
          { title }
        </div>
      </label>
    </div>
    
  )
}

export default Size