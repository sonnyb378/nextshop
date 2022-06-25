import React from 'react'

const Color:React.FC<{value: string, id: number, colorSelected:any, onChangeHandler:React.ChangeEventHandler}> = ({value, id, colorSelected, onChangeHandler}) => {
  const color = value.split("-")
  // console.log(value, color.length);
  // console.log("---> ",colorSelected, value, colorSelected===value);
  return (
    <>
    {
      color.length === 2 ? 
      <div className='h-full border-0 border-black space-x-2'>
        <input onChange={onChangeHandler} id={`color_radio${id}`} type="radio" name={`color_radio`} className="hidden" checked={colorSelected===value} /> 
        <label htmlFor={`color_radio${id}`} className="flex items-center text-sm">
          <div className={`rounded-full w-10 h-10 ring-offset-2 ring-1 ring-gray-300 p-1 m-1  
          ${colorSelected === value ? "ring-sky-800 ring-4" : "cursor-pointer hover:ring-primary hover:ring-2"}
          `} style={{ backgroundColor: `${color[1].trim()}` }}>
            
          </div> 
        </label>
        
      </div>
      : 
      <div className='h-full border-0 border-black space-x-2'>
        <input onChange={onChangeHandler} id={`color_radio${id}`} type="radio" name={`color_radio`} className="hidden" checked={colorSelected===value} /> 
        <label htmlFor={`color_radio${id}`} className="flex items-cente text-sm">
          <div className={`rounded-full w-10 h-10 ring-offset-2 ring-1 ring-gray-300 p-1 m-1  
          ${colorSelected === value ? "ring-sky-800 ring-4 " : "cursor-pointer hover:ring-primary hover:ring-2"}
          `} style={{ background: `linear-gradient(-45deg,
          ${color[1].trim()} 49%,
          ${color[2].trim()} 51%` 
          }}>
            {" "}
          </div>
        </label>
      </div>
      
    }
    </>
  )
}

export default Color;