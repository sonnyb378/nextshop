import { gql, mergeOptions } from '@apollo/client';
import Head from 'next/head';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import client from '../../utils/apolloClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { constructProductId } from '../../utils/getID';

import { 
  setBrowsingHistoryData, 
  removeProductInBrowsingHistory
} from '../../app/store/slices/browsinghistory';

import { useDispatch } from 'react-redux';

// import { ImageData } from '../../app/store/slices/browsinghistory';
// import { Product } from '../../app/store/slices/browsinghistory';
import { product_detail } from '../../model/productDetail';
import { kMaxLength } from 'buffer';

import { IImageStruct } from '../../ts/product/image_data';
import { IProduct } from '../../ts/product';
import { IPriceRange } from '../../ts/product/price_range';

import Color from '../../components/options/Color';
import Size from '../../components/options/Size';
import Style from '../../components/options/Style';
import Material from '../../components/options/Material';
import Quantity from '../../components/options/Quantity';
import Image from 'next/image';
import { getID } from '../../utils/getID';
import Link from 'next/link';
import auth, { selectAuth } from '../../app/store/slices/auth';

import { useAppSelector } from '../../app/hooks';
import { profile } from 'console';
import { selectProfile } from '../../app/store/slices/profile';
import { selectCart, setCartData } from '../../app/store/slices/cart';

import { constructSelectedOptions } from '../../utils/constructSelections';
import { fetchProductBySelectedOptions } from '../../utils/fetchProductBySelectedOptions';
import SideCart from '../../components/cart/SideCart';
import QuantityDropdown from '../../components/cart/QuantityDropdown';

import { XIcon, ExclamationCircleIcon } from "@heroicons/react/outline";

interface AlertStruct {
  title: string|null;
  qty: number;
}
const ProductDetail = (props:any) => {
  const dispatch = useDispatch();
  const auth = useAppSelector(selectAuth);
  const profile = useAppSelector(selectProfile);
  const cart = useAppSelector(selectCart);

  const [selectedColor, setSelectedColor] = useState({ option: "Color", name: "", hexColor: "", option_value: null});
  const [selectedSize, setSelectedSize] = useState({ option: "Size", option_value: null});
  const [selectedStyle, setSelectedStyle] = useState({ option: "Style", option_value: null});
  const [selectedMaterial, setSelectedMaterial] = useState({ option: "Material", option_value: null});

  const [ variant, setVariant] = useState<any|null>(null)
  const [itemQty, setItemQty] = useState(1);

  const [ alert, setAlert] = useState<AlertStruct>({ title: null, qty: 0});

  // const qtyRef = useRef<any>(null)

  // console.log("props: ", props);
  const { product, recommendations } = props

  // set default options
  useEffect(() => {
    product?.options.forEach((option:any) => {
      // console.log("Option name: ", option.name);
      option.values.forEach((value:any, k:any) => {
  
        if (k === 0) {
          const optionValue = value;
          switch (option.name) {
            case "Color": 
              const color = value.split("-");
              setSelectedColor((prevState) => { 
                return {
                  ...prevState, 
                  name: color[0], 
                  hexColor: `${color[1]}${color[2] ? `-${color[2]}` : ""}`, 
                  option_value: optionValue
                }
              }); 
              break;
            case "Size": setSelectedSize((prevState) => { 
              return {
                ...prevState, option_value: optionValue
              }}); break;
            case "Style": setSelectedStyle((prevState) => { 
              return {
                ...prevState, option_value: optionValue
              }}); break;
            case "Material": setSelectedMaterial((prevState) => { 
              return {
                ...prevState, option_value: optionValue
              }}); break;
          }
        }
      })
    })

  },[product?.options])

  // dispatch browsing history
  useEffect(() => {
    dispatch(removeProductInBrowsingHistory(product.id))
    const addProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      priceRange: {
        minVariantPrice: {
          amount: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        },
        maxVariantPrice: {
          amount: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        }
      } as IPriceRange,
      image: {
        id: product.images.edges[0].node.id,
        url: product.images.edges[0].node.url,
        width: product.images.edges[0].node.width,
        height: product.images.edges[0].node.height,
      } as IImageStruct
    } as IProduct
    dispatch(setBrowsingHistoryData(addProduct))
  },[dispatch, product.description, product.id, product.images.edges, product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode, product.title])

  const minVariant = product.priceRange.minVariantPrice;
  const maxVariant = product.priceRange.maxVariantPrice;

  let amountToDisplay = "";
  if (!variant) {
    amountToDisplay = minVariant.amount !== maxVariant.amount ? `${minVariant.currencyCode} +${parseFloat(minVariant.amount).toFixed(2)}` : `${maxVariant.currencyCode} ${parseFloat(maxVariant.amount).toFixed(2)}`
  } else {
    amountToDisplay = `${variant?.priceV2.currencyCode} ${parseFloat(variant?.priceV2.amount).toFixed(2)}`
  }


  useEffect(() => {
    const fetchVariantId = async (id:string) => {
      const variant = await fetchProductBySelectedOptions(selectedColor, selectedSize, selectedStyle, selectedMaterial, id);
      // console.log("variant: ", variant);
      setVariant(variant);
      // return variant;
    }
    
    fetchVariantId(product.id);    

  },[selectedColor, selectedSize, selectedStyle, selectedMaterial, product.id])


  const colorOnChangeHandler = (value: any) => {
    const color = value.split("-")
    setSelectedColor((prevState) => {
      return {
        ...prevState,
        name: color[0],
        hexColor: `${color[1]}${color[2] ? `-${color[2]}` : ""}`,
        // option_value: value.trim().split(" ").join("").toLowerCase()
        option_value: value
      }
    });
  }
  const styleOnChangeHandler = (value: any) => {
    setSelectedStyle((prevState) => {
      return {
        ...prevState,
        option_value: value
      }
    });
  }
  const sizeOnChangeHandler = (value:any) => {
    setSelectedSize((prevState) => {
      return {
        ...prevState,
        option_value: value
      }
    })
  }
  const materialOnChangeHandler = (value:any) => {
    // console.log("materialOnChangeHandler: ", value);
    setSelectedMaterial((prevState) => {
      return {
        ...prevState,
        option_value: value
      }
    });
  }

  const addToCartHandler = async (productId: string, title: string) => {
    // console.log("item added to cart! ", title);

    const cartAttributesObj = [{
      "key": "CustomerAuthToken",
      "value": auth.accessToken
    }]

    const buyerIdentityObj = {
      customerAccessToken: auth.accessToken,
      email: profile.email,
      phone: "",
    } as any
    
    if (profile.countryCode) {
      buyerIdentityObj["countryCode"] = profile.countryCode
    }

    const itemsAttributes = constructSelectedOptions(selectedColor, selectedSize, selectedStyle, selectedMaterial, "key")

    const cartItemsObj = [{
      attributes: itemsAttributes,
      merchandiseId: variant?.id,
      quantity: itemQty //parseInt(qtyRef?.current?.value),
      // sellingPlanId: "" 
    }]

    const cartCreateInputVariables = {
      discountCodes: [],
      lines: cartItemsObj,
      note: ""
    } as any

    if (auth.accessToken) {
      cartCreateInputVariables["buyerIdentity"] = buyerIdentityObj;
      cartCreateInputVariables["attributes"] = cartAttributesObj;
    }

    const cartLinesAddInputVariables = {
      cartId: cart.cartId,
      lines: {
        attributes: itemsAttributes,
        merchandiseId: variant.id,
        quantity: itemQty,
        // sellingPlanId: "" 
      },
    }

    // console.log("cartCreateInputVariables: ", cartCreateInputVariables);
    // console.log("cartLinesAddInputVariables: ", cartLinesAddInputVariables);

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/${cart.cartId ? "cart/line" : "cart" }`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartVariables: cart.cartId ? cartLinesAddInputVariables : cartCreateInputVariables
        })
      }
    );
    const result = await response.json();

    if (response.ok) {
      // console.log("cart result: ", result)      
      setAlert((prev) => {
        return { ...prev, 
          title: title, 
          qty: itemQty
        }
      });

      let itemcount = 0
      result.cart.lines.edges.forEach((line:any) => {
        itemcount += line.node.quantity;
      })
    
      dispatch(setCartData({ cartId: result.cart.id, itemsCount: itemcount}))

    }

  }

  const onQuantityChangeHandler = (e: any) => {
    // console.log("quantity: ", e);
    setItemQty(e);
  }

  const onCloseAlertHandler = () => {
    setAlert((prev) => {
      return { ...prev, 
        title: null, 
        qty: 0
      }
    });
  }
  
  return (
    <div>
      <Head>
        <title>Products Page</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col justify-between min-h-screen bg-gray-100'>
        <Header />
        {
          alert.title &&         
          <div onClick={onCloseAlertHandler} className="flex items-center justify-between w-full bg-green-200 p-5 shadow-md mb-5">
            <div>
              <ExclamationCircleIcon className="w-8 h-8"/>
            </div>
            <div className="flex-1 ml-2">
              { alert.title } (Qty: {alert.qty}) added to cart
            </div>
            <div className="cursor-pointer hover:text-red-500">
              <XIcon className="w-6 h-6"/>
            </div>
          </div>
        }
        <div className="p-5 mt-0">
          <h1 className='text-2xl font-bold'>Product Detail</h1>
        </div>
        <div className='flex flex-col w-full items-center justify-center flex-1 border-0 border-red-800 p-3 space-x-2 
        sm:flex-row sm:items-start'>
          
          <div className="flex items-start justify-center w-full h-full border-0 border-green-500 space-x-1
          sm:flex-row sm:w-1/2">

            <div className='flex flex-col items-center justify-center border-0 border-blue-500
            w-[120px]'>
              <div className="w-full max-h-[480px] overflow-auto scrollbar-hide border-0 border-red-500">
                {
                  product.images && product.images.edges.map((image:any, k:any) => { 
                      return <div key={k} className='mx-1 ring-1 ring-gray-200 mt-1'>
                        <div className='items-container'>
                          <Image
                            src={image.node.url}
                            alt={product.title}
                            layout="fill"
                            className='!relative !w-full !h-[unset]'
                          />
                        </div>
                      </div>
                  })
                }
              </div>
            </div>
            <div className='w-full h-[400px] border-0 border-orange-500 ring-1 ring-gray-200 mt-1'>
              <div className='w-full h-full relative'>
                <Image
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  // width={recommend.images.edges[0].node.width}
                  // height={recommend.images.edges[0].node.height}
                  layout="fill"
                  className='object-cover'
                />
              </div>             
            </div>

          </div>


          <div className="w-full h-full p-2 border-0 border-pink-500 sm:w-1/2">
            <div className='flex flex-col items-start justify-between'>
              <h1 className="text-2xl w-full font-bold truncate">{product.title}</h1>
              <h2 className="flex items-center justify-center text-lg font-bold text-amber-600">{amountToDisplay}</h2>
            </div>
            <div>
              {
                product?.options && product?.options.map((option:any, k:any) => {
                  return (
                  <div key={option.id} className="mt-5">
                    <span className="text-lg">
                      <span className="font-semibold">{option.name}</span> <span className="text-sky-800">{option.name === "Color" ? `- ${selectedColor.name}` : ""}</span>
                    </span>
                    <div className='flex flex-wrap items-start justify-start'>
                      {
                        option?.values && option.values.map((value:any, k:any) => {
                          // const option_value = value.trim().split(" ").join("").toLowerCase();
                          const option_value = value;
                          // console.log("option_value: ", option_value);
                          return (
                              option.name === "Color" ? <Color colorSelected={selectedColor.option_value} key={k} id={k} value={option_value} onChangeHandler={colorOnChangeHandler.bind(this,value)} />
                              : 
                              option.name === "Size" ? <Size sizeSelected={selectedSize.option_value} key={k} id={k} value={option_value} onChangeHandler={sizeOnChangeHandler.bind(this, option_value)} title={value}/>
                              : 
                              option.name === "Style" ? <Style key={k} styleSelected={selectedStyle.option_value} onChangeHandler={styleOnChangeHandler.bind(this, option_value)} id={k} value={option_value} title={value} />
                              : 
                              option.name === "Material" ? <Material key={k} id={k} value={option_value} materialSelected={selectedMaterial.option_value} onChangeHandler={materialOnChangeHandler.bind(this, option_value)} title={value}/>
                              : ""
                          )
                        })
                      }
                    </div>                    
                  </div>
                  )
                })
              }
              <div className='flex items-center justify-start mt-5'>
                {/* <Quantity refQty={qtyRef}/> */}
                <span className="mr-2 font-semibold text-lg">Quantity</span>
                <QuantityDropdown limit={variant?.quantityAvailable ? variant?.quantityAvailable : 0} 
                currentQty={itemQty} onQtyChangeHandler={(e:any) => onQuantityChangeHandler(e)} />
              </div>
            </div>
            {
              variant?.quantityAvailable > 0 ?
            
            <div onClick={addToCartHandler.bind(this, product.id, product.title)} className='flex items-center justify-center mt-5 w-full bg-sky-700 text-white rounded-xl py-2 cursor-pointer hover:text-orange-300 hover:bg-sky-800'>
              Add to Cart
            </div>
            :   
            <>
              <div className="mt-3 text-red-500">Out of Stock!</div>
              <div className='flex items-center justify-center mt-2 w-full bg-gray-400 text-white rounded-xl py-2 cursor-pointer '>
                Add to Cart
              </div>
            </>
            }
            <div className='mt-5'>
              <p>{product.description}</p>
            </div>
          </div>
          
        </div>
        {
          recommendations && recommendations.length > 0 &&
            <div className='flex flex-col items-start justify-start w-full p-2 border-0 border-lime-500'>
            <h1 className="text-2xl">Recommendations:</h1>

            <div className="flex flex-col items-center justify-start overflow-auto scrollbar-hide border-0 border-orange-500 w-full max-h-[300px] mt-3
            sm:flex-row">
            
              {
                recommendations.map((recommend:any, k: any) => {
                  const { priceRange: {
                    minVariantPrice: {
                      amount: minAmount,
                      currencyCode: minCurrencyCode
                    },
                    maxVariantPrice: {
                      amount: maxAmount,
                      currencyCode: maxCurrencyCode
                    }
                  }} = recommend;
                  const amountToDisplay = minAmount === maxAmount ? `${maxCurrencyCode} ${parseFloat(maxAmount).toFixed(2)}` : `${maxCurrencyCode} +${parseFloat(maxAmount).toFixed(2)}`
                  return (
                    <div key={k} className="flex items-center justify-center w-full h-full mb-1 p-1 border-0 border-black sm:min-w-[200px] sm:max-w-[200px]">
                      <div  className="flex items-center justify-center ring-1 ring-gray-300 bg-white
                      w-full h-[150px]
                      sm:flex-col sm:min-h-[250px]">

                        <div className='flex w-1/3 h-full bg-gray-300 relative
                        sm:w-full sm:h-1/2'>
                          <div className='w-full h-full relative'>
                            <Image
                              src={recommend.images.edges[0].node.url}
                              alt={recommend.title}
                              // width={recommend.images.edges[0].node.width}
                              // height={recommend.images.edges[0].node.height}
                              layout="fill"
                              className='object-cover'
                            />
                          </div>
                        </div>

                        <div className='flex flex-col w-2/3 h-full border-0 border-pink-300 p-2
                        sm:w-full sm:h-1/2'>
                          <h1 className='font-bold sm:truncate'>{ recommend.title}</h1>
                          <h3 className="text-amber-600">{amountToDisplay}</h3>
                          <p className='text-xs mt-1 overflow-ellipsis truncate h-[30px] overflow-hidden border-0 border-red-500'>{ recommend.description}</p>
                          
                          <Link href={`/products/${getID(recommend.id)}`}>
                            <div className='flex items-center justify-center mt-2 py-1 w-full bg-sky-700 rounded-lg text-sm text-white cursor-pointer hover:text-orange-300 hover:bg-sky-800'>
                              view
                            </div>
                          </Link>
                        
                        </div>

                      </div>
                    </div>                  
                  )
                })
              }
              

            
            </div>
            </div>
        
        }

        <Footer />
      </main>
    </div>
  )
}

export default ProductDetail

export async function getServerSideProps (ctx: any) {
  const id = constructProductId(ctx.query.id)
  const rawId = ctx.query.id
  // console.log("---> ", ctx.query.id[0]);

  const [req1,req2] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products/${ctx.query.id}`, {
      method: "GET",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }),
    await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products/recommendations`, {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        productId: rawId
      })
    }),
  ])

  const [res1, res2] = await Promise.all([
    req1.json(),
    req2.json()
  ])

  return {
    props: {
      product: res1?.product,
      recommendations: res2?.recommendations
    }
  }
}




// mutation cartCreate($input: CartInput!) {
//   cartCreate(input: $input) {
//     cart {
//       id
//       attributes {
//         key
//         value
//       }
//       buyerIdentity {
//         customer {
//           id
//           email
//           defaultAddress {
//             address1
//             address2
//             city
//             province
//             provinceCode
//             zip
//             country
//             countryCodeV2
//           }
//         }
//         email
//         countryCode
//       }
//       checkoutUrl
//       discountCodes {
//         applicable
//         code
//       }
//       estimatedCost {
//         subtotalAmount {
//           amount
//           currencyCode
//         }
//         totalAmount {
//           amount
//           currencyCode
//         }
//         totalDutyAmount {
//           amount
//           currencyCode
//         }
//         totalTaxAmount {
//           amount
//           currencyCode
//         }
//       }

//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }

// {
//   "input": {
//     "attributes": [
//       {
//         "key": "cart-key",
//         "value": "cart-value"
//       }
//     ],
//     "buyerIdentity": null,
//     "lines": [
//       {
//         "attributes": [
//           {
//           	"key": "Color",
//           	"value": "Black"
//         	},
//           {
//           	"key": "Size",
//           	"value": "Small"
//         	},
//           {
//           	"key": "Material",
//           	"value": "Cotton"
//         	}
//         ],
//         "merchandiseId": "gid://shopify/Product/7014874251470",
//         "quantity": 1
//       }
//     ],
//     "note": "cart note"
//   }
// }


// query cart($id: ID!) {
//   cart(id: $id) {
//     id
//     estimatedCost {
//       totalAmount {
//         amount
//         currencyCode
//       }
//       subtotalAmount {
//         amount
//         currencyCode
//       }
//       totalDutyAmount {
//         amount
//         currencyCode
//       }
//       totalTaxAmount {
//         amount
//         currencyCode
//       }
//     }
//     lines(first: 10) {
//           edges {
//             node {
//               id
//               attributes {
//                 key
//                 value
//               }
//               quantity
//               estimatedCost {
//                 totalAmount {
//                   amount
//                   currencyCode
//                 }
//                 subtotalAmount {
//                   amount
//                   currencyCode
//                 }
//               }
//             }
//           }
//           pageInfo {
//             endCursor
//             hasNextPage
//             hasPreviousPage
//             startCursor
//           }
//         }
//   }
// }
// {
//   "id":"gid://shopify/Cart/350fe8ee4e7fbba55bf2e702ed14aa1f"
// }