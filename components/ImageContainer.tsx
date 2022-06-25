import React, { ImgHTMLAttributes } from 'react'
import Image from 'next/image'

const ImageContainer:React.FC<{url:string, title: string, outerClass: string, imageContainerClass: string, imageClass:string, 
  width?: string|number, 
  height?: string|number, 
  layout:"fill" | "fixed" | "intrinsic" | "responsive" | "raw" | undefined}> = ({url, title, outerClass, imageContainerClass, imageClass, width, height, layout}) => {

  return (
    <div className={outerClass}>            
      <div className={imageContainerClass}>
        <Image
          src={url}
          alt={title}
          layout={layout}
          width={width}
          height={height}
          className={imageClass}
        />
      </div> 
    </div>
  )
}

export default ImageContainer