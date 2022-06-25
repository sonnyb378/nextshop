import React from 'react'

const InputFields:React.FC<{title:string; type:string; id:string; name:string; placeholder:string,onChangeHandler:any, value:any, disabled?:boolean, required?:boolean}> = ({title, type, id, name, placeholder, onChangeHandler, value, disabled, required}) => {

  return (
    <div className="relative w-full bg-white shadow-sm text-left">
    <label htmlFor={id}>{
      title
    }</label>
    <input type={type} name={name} id={id} placeholder={placeholder} value={value} 
    onChange={onChangeHandler}
    className="w-full bg-slate-50 mt-1 border-transparent ring-1 ring-gray-200 rounded-lg py-2
    placeholder-gray-400 placeholder:text-xs
    focus:border-transparent
    focus:ring-1 focus:ring-sky-700 focus:shadow-none
    "
    disabled={disabled}
    required={required}
    />
  </div>
  )
}

export default InputFields