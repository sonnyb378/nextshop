import { constants } from 'buffer';
import React, { useState } from 'react'

const Style:React.FC<{value:string, id: number, title: string, styleSelected:any, onChangeHandler:React.ChangeEventHandler}> = ({value, id, title, styleSelected, onChangeHandler}) => {
  // console.log(styleSelected," = ", value);
  return (
    <div className="w-full mt-1">
      <input onChange={onChangeHandler} id={`style_radio${id}`} type="radio" name={`style_radio`} className="hidden" 
      checked={styleSelected===value}/> 
      <label htmlFor={`style_radio${id}`} className="flex items-center justify-start w-full cursor-pointer text-sm border-0 border-black">

        <span className="w-8 h-8 mr-2 rounded-full inline-block ring-1 ring-gray-300 flex-no-shrink sm:w-9"></span>
        
        <h3 className="w-full sm:truncate">{title}</h3>
      
      </label>
    </div>
  )
}

export default Style;