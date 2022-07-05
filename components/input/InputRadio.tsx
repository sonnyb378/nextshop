import React from 'react'

const InputRadio:React.FC<{
  onChangeHandler:React.ChangeEventHandler, 
  selectedValue: string|null,
  value: string|null,
  id: string,
  name: string,
  title: string
}> = ({onChangeHandler, selectedValue, value, id, name, title}) => {
  // console.log("selectedValue: ",selectedValue, value);
  // console.log("title: ",title.includes("|"));
  const titleName = title.includes("|") ? title.trim().split("|") : title;
  // console.log("titleName: ", typeof titleName);
  return (
    <div className="w-full mt-1">
      <input onChange={onChangeHandler} id={`${id}`} type="radio" name={name} className="hidden" 
      checked={selectedValue===value}/> 
      <label htmlFor={`${id}`} className="flex items-start justify-start w-full cursor-pointer text-sm p-1 border-0 border-black">

        <span className="w-6 h-6 mr-2 rounded-full inline-block ring-1 ring-gray-300 flex-no-shrink "></span>
        
        <h3 className="w-full sm:truncate">
          {
            typeof titleName === "object" ? 
            <div className="flex flex-col w-full">
              <div className="text-semibold">{titleName[0].trim()}</div>
              <div className="line-clamp-1 text-gray-600 text-xs">{titleName[1].trim()}</div>
            </div>
            :
            <div>{titleName}</div>
          }

        </h3>
      
      </label>
    </div>
  )
}

export default InputRadio