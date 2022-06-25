import React from 'react'

const PageContent:React.FC<{children:any}> = ({children}) => {
  return (
    <div className="flex flex-col w-full mt-10">
      {children}
    </div>
  )
}

export default PageContent;