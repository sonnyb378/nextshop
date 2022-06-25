import React from 'react'

const Material:React.FC<{value: string, id: number,title: string, materialSelected:any, onChangeHandler:React.ChangeEventHandler}> = ({value, id, title, materialSelected, onChangeHandler}) => {
  // console.log("MATERIAL: ", materialSelected, value);
  return (
    <div className='h-full border-0 border-black'>
      <input onChange={onChangeHandler} id={`material_radio${id}`} type="radio" name={`material_radio`} className="hidden" checked={materialSelected===value} />
      <label htmlFor={`material_radio${id}`} className="flex items-center text-sm">
        <div className={`px-5 py-2 m-1 rounded-lg ring-1 ring-gray-300  
        ${materialSelected === value ? "ring-sky-800 ring-2 bg-sky-800 text-white" : "bg-gray-200 cursor-pointer hover:ring-2 hover:ring-primary hover:text-primary hover:bg-gray-300"}
        `}>
          { title }
        </div>
      </label>
    </div>
  )
}

export default Material