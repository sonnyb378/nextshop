import React, { PropsWithChildren } from 'react'

type Props = {
  title:string;
  subtitle:string;
  children?:JSX.Element;
}
const PageHeader: React.FC<Props> = ({title, subtitle, children}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-2xl">{title}</h1>
        <h2 className="text-xs text-gray-400">{subtitle}</h2>
      </div>
      {children}
    </div>
  )
}

export default PageHeader