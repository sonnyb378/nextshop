import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer';
import Header from '../../components/Header';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCart, setCartData } from '../../app/store/slices/cart';

import { selectCheckout, setCheckoutData } from '../../app/store/slices/checkout'; 
import { gql, useQuery, useMutation } from '@apollo/client';
import Image from 'next/image';

import QuantityDropdown from '../../components/cart/QuantityDropdown';
import { getID } from '../../utils/getID';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Spinner from '../../components/Spinner';

import { ILinesEdges, ICartDataStruct, ICartCost } from '../../ts/cart/interfaces/cart';
import { fakeCartItems } from '../../model/fake_cart_items';
import { selectAuth} from '../../app/store/slices/auth';

import { useAppContext, useAppContextSetters } from '../../context/state';
import { ShopifyFunctions } from '../../utils/shopifyFunctions';
import { selectProfile } from '../../app/store/slices/profile';
import { setFlagsFromString } from 'v8';

const Cart = (props: any) => {

  const auth = useAppSelector(selectAuth);
  const cart = useAppSelector(selectCart);
  const checkout = useAppSelector(selectCheckout);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector(selectProfile);

  const [cartItems, setCartItems] = useState<[ILinesEdges]|null>(null);
  const [cartCost, setCartCost] = useState<ICartCost>();

  const [resultCartData, setResultCartData] = useState<ICartDataStruct>()

  const [loadingCart, setLoadingCart] = useState(false);

  const { cart: ctxCart, checkout: ctxCheckout} = useAppContext();
  const { setCtxCart, setCtxCheckout } = useAppContextSetters(); 

  useEffect(() => {
    const getCart = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/${getID(cart?.cartId!)}`)
      const result = await response.json();
      if (response.ok) {
        // console.log("setResultCartData: ", result?.data);
        setLoadingCart(false)
        setResultCartData(result?.data);
        setCtxCart(result?.data)
      }
    }

    const checkoutAttributesUpdate = async () => {
      if (checkout.checkoutId) {
        const checkoutId = checkout.checkoutId;
        const input = {
          customAttributes: [
            {
              key: "cart",
              value: cart.cartId
            }
          ]
        }
        const sf = new ShopifyFunctions();
        const { response, result } = await sf.checkoutAttributesUpdateV2(checkoutId, input);
        if (response.ok) {
          setCtxCheckout(result.checkout);    
        }
        
      }      
    }
    
    if (cart.cartId) {
      setLoadingCart(true)
      getCart();
    }

    checkoutAttributesUpdate();

    
  }, [cart?.cartId, setCtxCart, checkout.checkoutId, profile.email, setCtxCheckout, auth.accessToken])

  useEffect(() => {
    setCartItems(resultCartData?.lines?.edges!);
    setCartCost(resultCartData?.estimatedCost!);
  },[resultCartData?.lines?.edges, resultCartData?.estimatedCost])
  
  const removeCartLineHandler = async (lineId: string) => {
    // cart line
    const sf = new ShopifyFunctions();
    const { response, result: removeResult } = await sf.cartLinesRemove(cart.cartId!, [lineId])
    
    if (response.ok) {
      if (removeResult) {
        let itemcount = 0
        removeResult.cartLinesRemove.cart.lines.edges.forEach((line:any) => {
          itemcount += line.node.quantity;
        })
        dispatch(setCartData({ 
          cartId: removeResult.cartLinesRemove.cart.id, 
          itemsCount: itemcount
        }))
        setCartItems(removeResult?.cartLinesRemove?.cart?.lines?.edges!);
        setCartCost(removeResult?.cartLinesRemove?.cart.estimatedCost);
        setCtxCart(
          {
            id: removeResult.cartLinesRemove.cart.id, 
            estimatedCost: removeResult.cartLinesRemove.cart.estimatedCost,
            lines: removeResult?.cartLinesRemove?.cart?.lines
          }
        )
      }
      
    }

    // //checkout line
    if (checkout.checkoutId) {
      const variant = ctxCart?.lines?.edges?.find((item:any) => {
        return item.node.id === lineId;
      })
      const sf = new ShopifyFunctions();
      const checkoutLineItem = await sf.getCheckoutLineId(ctxCheckout, `${variant?.node.merchandise.id}`);
      const checkoutId = checkout.checkoutId;
      const checkoutLineItemId = checkoutLineItem.node.id;
      const { response, result } = await sf.checkoutLineItemsRemove(checkoutId, [checkoutLineItemId])
      if (response.ok) {
        setCtxCheckout(result?.checkout);
      }
    }

  }

  const onQuantityChangeHandler = async (q: number, line:any) => {

    const attrs = line.attributes.map((attr:any, k:any) => {
      return {
        key: attr.key,
        value: attr.value
      }
    })

    const variables = {
      "cartId": cart.cartId,
      "lines": {
        "attributes": attrs,
        "id": line.id,
        "merchandiseId": line.merchandise.id,
        "quantity": q
      }
    }

    const sf = new ShopifyFunctions();
    const { response: updateCartResponse, result:updateCartResult } = await sf.cartLinesUpdate(variables);

    if (updateCartResponse.ok) {
      if (updateCartResult) {
        let itemcount = 0
        updateCartResult.cartLinesUpdate.cart.lines.edges.forEach((line:any) => {
          itemcount += line.node.quantity;
        })
        dispatch(setCartData({ 
          cartId: updateCartResult.cartLinesUpdate.cart.id, 
          itemsCount: itemcount
        }))
        setCartItems(updateCartResult?.cartLinesUpdate?.cart?.lines?.edges!);
        setCartCost(updateCartResult?.cartLinesUpdate?.cart.estimatedCost);
        setCtxCart(
          {
            id: updateCartResult.cartLinesUpdate.cart.id, 
            estimatedCost: updateCartResult.cartLinesUpdate.cart.estimatedCost,
            lines: updateCartResult?.cartLinesUpdate?.cart?.lines
          }
        )
      }
    }

    // checkoutLineItemsUpdate
    if (checkout.checkoutId) {
      const cartLineVariantId = line.merchandise.id;
      const sf = new ShopifyFunctions();

      const checkoutLineItem = await sf.getCheckoutLineId(ctxCheckout, `${cartLineVariantId}`);
      const attrs = checkoutLineItem.node.customAttributes.map((item:any) => {
        return { key: item.key, value: item.value }
      })
      const inputVars = {
        checkoutId: `${checkout.checkoutId}`,
        lineItems: {
          customAttributes: attrs,
          id: checkoutLineItem.node.id,
          quantity: q,
          variantId: cartLineVariantId
        }
      }
      const { response, result } = await sf.checkoutLineItemsUpdate(inputVars.checkoutId, inputVars.lineItems) 
      if (response.ok) {
        setCtxCheckout(result?.checkout);
      }
      
    }
    

  }

  const onRedirectHandler = (id:string) => {
    router.push(`/products/${id}`)
  }

  const onCheckoutHandler = async () => {
    // console.log("checkoutId: ", checkout.checkoutId );

    if (checkout.checkoutId) {
      // checkoutAttributesUpdateV2
      if (auth.accessToken) {
        const checkoutId = checkout.checkoutId;
        const sf = new ShopifyFunctions();
        const input = {
          customAttributes: [
            {
              key: "cart",
              value: cart.cartId
            }
          ]
        }
        const { response, result } = await sf.checkoutAttributesUpdateV2(checkoutId, input);
        if (response.ok) {
          console.log("checkoutAttributesUpdate: ", result);
          setCtxCheckout(result?.checkout);    
          router.push('/checkout')
        }        
      } else {
        router.push('/auth/signin?redirect=cart')
      }
    } else {
      // checkoutCreate
      const variants = ctxCart.lines?.edges?.map((variant:any) => {
        return {
          variantId: variant.node.merchandise.id,
          quantity: variant.node.quantity
        }
      })
      const inputVars = {
        allowPartialAddresses: true,
        lineItems: variants
      }
      
      const sf = new ShopifyFunctions();
      const { response, result } = await sf.checkoutCreate(inputVars);

      if (response.ok) {
        setCtxCheckout(result);              
        dispatch(setCheckoutData({
          checkoutId: result.checkout.id,
          webUrl: result.checkout.webUrl
        }))

        if (auth.accessToken) {
          console.log("checkoutCreate: 1: ", result);
          router.push('/checkout')
        } else {
          router.push('/auth/signin?redirect=cart')
        }
      } else {
        if (auth.accessToken) {
          console.log("checkoutCreate: 2:  ", result);
          router.push('/checkout')
        } else {
          router.push('/auth/signin?redirect=cart')
        }
      }

    }
    
  }


  const renderCartItems = cartItems && cartItems.map((product:any, k:any) => {
    // console.log(product)

    return <div key={k} className="flex items-stretch justify-start ring-1 ring-gray-300 p-5 rounded-xl mb-2 bg-white relative">
      <div className="ring-0 ring-gray-100 w-[150px] h-[150px] relative overflow-hidden group">        
        <Image 
        onClick={() => onRedirectHandler(`${getID(product.node.merchandise.product.id)}`)}
          src={product.node.merchandise.image.url}
          alt={product.node.merchandise.product.title}
          // width={product.node.merchandise.image.width}
          // height={product.node.merchandise.image.height}
          layout="fill"
          className="object-contain scale-125 
          transition-all cursor-pointer group-hover:scale-150 "
        />
      </div>
      <div className="flex flex-col flex-1 ring-0 ring-black p-2 justify-between">
        <div className="flex flex-col">
          <span onClick={() => onRedirectHandler(`${getID(product.node.merchandise.product.id)}`)} className="font-bold block text-lg 
          cursor-pointer hover:text-primary">
            { product.node.merchandise.product.title }
          </span>
          <span className='text-gray-600 w-full h-12 line-clamp-2'>
            { product.node.merchandise.product.description }
          </span>
          <div className="flex item-start justify-start text-sm text-gray-500">
            { 
              product.node.attributes && product.node.attributes.map((attr:any, k:any) => {
                return <div key={k} className="
                after:content-['\00a0|\00a0'] last:after:content-[''] 
                before:content-['\00a0']
                first:before:content-['']
                whitespace_normal
                line-clamp-1
                ">
                  { attr.value.split("-")[0]}
                </div>
              })
            }
          </div>
        </div>
        <div>
          <div className='h-full border-0 border-black mt-5'>      
            <label htmlFor="qty" className="flex items-center text-sm">
              <span className="mr-2 text-lg">Qty:</span>

              <QuantityDropdown limit={product.node.merchandise.quantityAvailable ? product.node.merchandise.quantityAvailable : 0} currentQty={product.node.quantity} onQtyChangeHandler={(e:any) => onQuantityChangeHandler(e, product.node)} />

            </label>
          </div>
        </div>

      </div>
      <div className="flex flex-col items-stretch justify-between pt-2">
          <div className="flex-1 items-center justify-end font-bold">
            {product.node.merchandise.priceV2.currencyCode}{" "}
            { 
              product.node.quantity > 1 ? 
              parseFloat(String(product.node.quantity * product.node.merchandise.priceV2.amount)).toFixed(2)
              :
              parseFloat(product.node.merchandise.priceV2.amount).toFixed(2)
            }
          </div>
          <div className="flex flex-1 items-end justify-end">
            <button onClick={(e) => removeCartLineHandler(`${product.node.id}`)} className="bg-red-500 text-white py-2 px-5 text-xs rounded-full cursor-pointer
            hover:text-orange-200 hover:bg-red-600">
              Remove
            </button>
          </div>
      </div>
    </div>
  });
  


  // useEffect(() => {
  //   console.log("cart: ctxCart: ", ctxCart);
  //   console.log("cart: ctxCheckout: ", ctxCheckout);
  // })

  return (
    <div>
      <Head>
        <title>Products Page</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col items-stretch justify-between bg-slate-200 min-h-screen'>
        <Header />
        <div className="flex flex-1 flex-col  p-5 ">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <div className="flex flex-col justify-between mt-10 
          md:flex-row ">
            {
              // !loading && 
              <>  
                <div className="flex flex-col md:w-2/3">
                  { 
                  cartItems && cartItems.length > 0 ? renderCartItems 
                  : 
                  loadingCart ? <Spinner primaryColor="fill-primary" secondaryColor='text-slate-300'
                  title="Loading..."
                  /> :
                  <div>No items in shopping cart</div>  
                  }          
                </div>
                <div className='mt-5 text-sm space-y-2 
                md:mt-0 md:p-5 md:w-1/3'>
                  <h1 className="text-lg font-semibold">Order Summary</h1>
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span>{cartCost?.subtotalAmount ? cartCost?.subtotalAmount?.currencyCode : ""} 
                    {" "}
                    {cartCost?.subtotalAmount ? parseFloat(cartCost?.subtotalAmount?.amount!).toFixed(2) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping Estimate:</span>
                    <span>-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax Estimate:</span>
                    <span>{cartCost?.totalTaxAmount ? cartCost?.totalTaxAmount?.currencyCode:""}
                    {" "}
                    {cartCost?.totalTaxAmount ? parseFloat(cartCost?.totalTaxAmount?.amount!).toFixed(2) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-black pt-2 text-sky-900">
                    <span className="text-lg font-bold">Order Total:</span>
                    <span className="text-lg font-bold">{cartCost?.totalAmount ? cartCost?.totalAmount?.currencyCode : ""}{" "} 
                    {
                    cartCost?.totalAmount ? parseFloat(cartCost?.totalAmount?.amount!).toFixed(2) : "-"}</span>
                  </div>
                  
                  
                  <div onClick={onCheckoutHandler} className="flex items-center justify-center w-full bg-sky-700 py-3 px-5 text-white rounded-lg cursor-pointer mmt-6 hover:text-orange-200">
                    Checkout
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    * Shipping cost and tax will be computed in checkout
                  </div>

                </div>            
              </>
            }
          </div>
          
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default Cart;