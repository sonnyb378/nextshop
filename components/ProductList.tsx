import React from "react";
import { getID } from "../utils/getID";
import ImageContainer from "./ImageContainer";
import ItemCard from "./ItemCard";
ImageContainer


const ProductList:React.FC<{products: any}> = ({products}) => {

  // console.log("ProdctList: ", products);
  return (
    <div className="bg-white border-0 border-blue-500 grow">
      <div className="max-w-2xl py-16 px-4 sm:py-2 sm:px-2 lg:max-w-7xl lg:px-8 border-0 border-red-500">

        <div className="mt-6 grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-2">
          {products.map((product:any) => {
            const { id, handle, title, body_html: description, images: [
              {
                id: imgId, height: imgHeight, width: imgWidth, src: imgUrl 
              }
            ], variants} = product;

            const amountToDisplay = variants.length > 0 ? `+${parseFloat(variants[0].price).toFixed(2)}` : `${parseFloat(variants[0].price).toFixed(2)}`
            const productID = id
            return(
              <ItemCard 
                key={productID}
                id={id}
                title={title}
                description={description.replace(/(<([^>]+)>)/gi, "")}
                minCurrencyCode="USD"
                amountToDisplay={amountToDisplay}
                productID={productID}
                className={`flex flex-col items-center justify-between w-full h-96 ring-1 ring-gray-200 bg-white`}
                ImgComponent={
                  <ImageContainer 
                    url={imgUrl} 
                    title={title} 
                    outerClass="flex flex-col flex-1 w-[200px] items-center justify-center mb-2 bg-white"
                    layout="fill"
                    imageContainerClass="items-container w-[150px] relative" 
                    imageClass="!relative !w-full !h-[unset]"
                  />
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductList;