import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer';
import Header from '../../components/Header';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCart, setCartData } from '../../app/store/slices/cart';
import Image from 'next/image';

import QuantityDropdown from '../../components/cart/QuantityDropdown';
import { TrashIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/outline';
import { getID } from '../../utils/getID';
import InputFields from '../../components/input/InputFields';
import Dropdown from '../../components/input/Dropdown';
import { Countries } from '../../model/countries';

// import { UserAddress } from '../../pages/profile/address/index'
import { selectAuth } from '../../app/store/slices/auth';
import { selectProfile } from '../../app/store/slices/profile';
import { selectCheckout } from '../../app/store/slices/checkout';

import InputRadio from '../../components/input/InputRadio';
import { useRouter } from 'next/router';
import Spinner from "../../components/Spinner";

// import { ILinesEdges, ICartDataStruct, ICartCost  } from '../../ts/cart/interfaces/cart';
import { IUserAddress } from '../../ts/profile/addresses/address';

import { useAppContext, useAppContextSetters } from '../../context/state';

import { setCheckoutData } from '../../app/store/slices/checkout';
import DropdownAddress from '../../components/input/DropdownAddress';
import { ShopifyFunctions } from '../../utils/shopifyFunctions';

// import { IShippingInformation } from '../../ts/context/interfaces/shipping_information';

const deliveryMethod = [
  {
    id: 1,
    title: "Standard",
    subtitle: "4-10 business days",
    price: {
      amount: "5.00",
      currencyCode: "USD"
    }
  },
  {
    id: 2,
    title: "Express",
    subtitle: "2-5 business days",
    price: {
      amount: "16.00",
      currencyCode: "USD"
    }
  }
]

interface CheckoutCreateData {
  availableShippingRates: {
    ready: boolean;
    shippingRates: [
      {
        handle: string;
        title: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        }
      }
    ]
  },
  subtotalPriceV2: any,
  shippingLine: any,
  totalTaxV2: any
  totalPriceV2: any,
  lineItems: any
}

const Checkout = (props: any) => {
  const cart = useAppSelector(selectCart);
  const profile = useAppSelector(selectProfile);
  const auth = useAppSelector(selectAuth)
  const checkout = useAppSelector(selectCheckout);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ pageLoading, setPageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");

  const [shippingInformationLoading, setShippingInformationLoading] = useState(false);
  const [shippingRateLoading, setShippingRateLoading] = useState(false);
  const [paymentMethodLoading, setPaymentMethodLoading] = useState(false);

  const [shippingAddressSelected, setShippingAddressSelected] = useState(false);
  const [shippingRateSelected, setShippingRateSelected] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [allowConfirmOrder, setAllowConfirmOrder] = useState(false);

  const [checkoutCreateData, setCheckoutCreateData] = useState<CheckoutCreateData|null>(null);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string|null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string|null>("cc");

  const { 
    cart: ctxCart, 
    checkout: ctxCheckout,
    contactInformation: ctxContactInformation, 
    shippingInformation: ctxShippingInformation,
    deliveryMethod: ctxDeliveryMethod,
    paymentMethod: ctxPaymentMethod
  } = useAppContext();

  const { 
    setCtxCart,
    setCtxCheckout,
    setCtxContactInformation,
    setCtxShippingInformation,
    setCtxDeliveryMethod,
    setCtxPaymentMethod
  } = useAppContextSetters();


  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/auth/signin")
    } else {
      // setPageLoading(false)
      // console.log("----> ", ctxCart.lines);
      if (!ctxCart.lines) {
        // console.log("redirect to signin page");
        router.push("/cart")
      } else {
        setPageLoading(false)
      }
    }
  },[auth.accessToken, router, ctxCart.lines])

  const [userAddresses, setUserAddresses] = useState<IUserAddress>({ 
    defaultAddress: null, 
    addresses:null
  });
  
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("")
  // const [selectedAddressText, setSelectedAddressText] = useState("");
  const [isChecked, setIsChecked] = useState(false)


  useEffect(() => {   
    const getCustomer = async () => {
      if (auth.accessToken) {
        const sf = new ShopifyFunctions();
        const {response,result} = await sf.customer(auth.accessToken);
        if (response.ok) {
          // setAddressLoading(false);   
          setLoadingCustomer(false)       
          setSelectedAddressId(result?.customer?.defaultAddress.id);
          setUserAddresses({
            defaultAddress: result?.customer?.defaultAddress, 
            addresses: result?.customer?.addresses?.edges
          });

          if (auth.accessToken) {
            const defaultAddress = result?.customer?.addresses?.edges.filter((address: { node: { id: string | undefined; }; }) => result?.customer?.defaultAddress.id === address.node.id)

            setShippingAddressSelected(false);
            setShippingRateSelected(false);  
            setPaymentMethodSelected(false)
            
            setCtxContactInformation(profile?.email!)
            if (defaultAddress) {
              setCtxShippingInformation({
                firstname: defaultAddress![0].node.firstName,
                lastname: defaultAddress![0].node.lastName,
                company: defaultAddress![0].node.company,
                address1: defaultAddress![0].node.address1,
                address2: defaultAddress![0].node.address2,
                city: defaultAddress![0].node.city,
                province: defaultAddress![0].node.province,
                zip: defaultAddress![0].node.zip,
                country: {
                  name: defaultAddress![0].node.countryCodeV2,
                  description: defaultAddress![0].node.country
                },
                phone: defaultAddress![0].node.phone,
              })              
            }            
          }

        }
      } else {
        setSelectedAddressId("new_address")
      }
    }
    // setAddressLoading(true)
    setLoadingCustomer(true)
    getCustomer();
  },[auth.accessToken, setCtxShippingInformation, profile?.email, setCtxContactInformation])

  useEffect(() => {
    // checkoutAttributesUpdateV2
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
          console.log("checkoutAttributesUpdateV2: ",result.checkout); 
        }
      }
    }
    checkoutAttributesUpdate();

    ////
  },[cart.cartId, checkout.checkoutId]);

  const removeCartLineHandler = async (lineId: string) => {
  
    const sf = new ShopifyFunctions();
    const { response, result: removeResult } = await sf.cartLinesRemove(cart.cartId!, [lineId])
    
    if (response.ok) {
      // console.log("removeResult: ", removeResult);
      if (removeResult) {
        let itemcount = 0
        removeResult.cartLinesRemove.cart.lines.edges.forEach((line:any) => {
          itemcount += line.node.quantity;
        })
        dispatch(setCartData({ 
          cartId: removeResult.cartLinesRemove.cart.id, 
          itemsCount: itemcount
        }))
        setCtxCart(
          {
            id: removeResult.cartLinesRemove.cart.id, 
            estimatedCost: removeResult.cartLinesRemove.cart.estimatedCost,
            lines: removeResult.cartLinesRemove?.cart?.lines
          }
        )
      }
    }

    // get checkout line id
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

    // const checkoutLine = checkoutCreateData && checkoutCreateData?.lineItems?.edges?.filter((item:any) => {
    //   return item.node.variant.id === line.merchandise.id;
    // })
    // console.log("checkoutLine: ", checkoutLine);

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
      if (updateCartResponse) {
        let itemcount = 0
        updateCartResult.cartLinesUpdate.cart.lines.edges.forEach((line:any) => {
          itemcount += line.node.quantity;
        })
        dispatch(setCartData({ 
          cartId: updateCartResult.cartLinesUpdate.cart.id, 
          itemsCount: itemcount
        }))
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

  const onSelectAddress = (e:any) => {
    // console.log("selected address: ", e);
    setHasError(false)
    if (e === "new_address") {
      setSelectedAddressId("new_address");
      setCtxShippingInformation({
        ...ctxShippingInformation,
        firstname: "",
        lastname: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        zip: "",
        country: Countries[231],
        phone: ""
      })
      setIsChecked(true)
    } else {
      setSelectedAddressId(e);
      const selected = userAddresses?.addresses?.filter(address => e === address.node.id)
      setCtxShippingInformation({
        ...ctxShippingInformation,
        firstname: selected![0].node.firstName,
        lastname: selected![0].node.lastName,
        company: selected![0].node.company,
        address1: selected![0].node.address1,
        address2: selected![0].node.address2,
        city: selected![0].node.city,
        province: selected![0].node.province,
        zip: selected![0].node.zip,
        country: {
          name: selected![0].node.countryCodeV2,
          description: selected![0].node.country
        },
        phone: selected![0].node.phone,
      })
      setIsChecked(false);
    }

  }

  const onSelectShippingRate = (handle:any) => {
    setSelectedShippingRate(handle)  
  }

  const onSelectPaymentMethod = (value:any) => {
    console.log("payment method: ", value);
    setSelectedPaymentMethod(value)

    if (value === "paypal") {
      setCtxPaymentMethod({
        ...ctxPaymentMethod,
        type: value,
        info: {
          cc: "",
          nameoncc: "",
          expdate: "",
          cvv: ""
        }
      })
    } else {
      setCtxPaymentMethod({
        ...ctxPaymentMethod,
        type: value
      })
    }

  }

  const onRedirectHandler = (id:string) => {
    router.push(`/products/${id}`)
  }

  const onLoginHandler = () => {
    router.push('/auth/signin?redirect=checkout')
  }

  const onShippingAddressHandler = async () => {
    setShippingInformationLoading(true);
    
    const {
      firstname: firstName,
      lastname: lastName,
      address1, address2, city, company, country, province, zip, phone
    } = ctxShippingInformation

    if (!firstName || !lastName || !address1 || !city || !zip || !province) {
      // console.log("required field");
      setHasError(true)
      setShippingInformationLoading(false);
      setShippingAddressSelected(false)
      return
    }

    const addressShipping = {
      address1: address1,
      address2: address2,
      city: city,
      company: company,
      country: country.description,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      province: province,
      zip: zip
    }

    if (checkout.checkoutId) {
      const sf = new ShopifyFunctions();
      // checkoutShippingAddressUpdateV2
      const { response, result } = await sf.checkoutShippingAddressUpdateV2(checkout.checkoutId, addressShipping);
      if (response.ok) {
        setCheckoutCreateData(result.checkout)
        setSelectedShippingRate(result.checkout?.availableShippingRates?.shippingRates[0].handle || null)
        setShippingInformationLoading(false);
        setShippingAddressSelected(true)
        dispatch(setCheckoutData({
          checkoutId: result.checkout.id,
          webUrl: result.checkout.webUrl
        }))
      }
      // console.log("isChecked: ", isChecked);
      // customerAddressCreate
      if (isChecked) {
        const { response, result } = await sf.customerAddressCreate(addressShipping, `${auth.accessToken}`)
        if (response.ok) {
            setSelectedAddressId("new_address");
        }
      } 

      // get customer address
      const {
        response: responseCustomer, 
        result: resultCustomer
      } = await sf.customer(`${auth.accessToken}`);

      if (responseCustomer.ok) { 
        // console.log("customer: ", resultCustomer);
        setUserAddresses({
          defaultAddress: resultCustomer?.customer?.defaultAddress, 
          addresses: resultCustomer?.customer?.addresses?.edges
        });
      }

    } else {
      router.push('/cart')
    }
    

  }

  const onDeliveryMethodHandler = async () => {
    console.log('shipping rate selected: ', selectedShippingRate);    
    setShippingRateLoading(true)

    // checkoutShippingLineUpdate
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/shippingrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        checkoutId: checkout.checkoutId,
        shippingRateHandle: selectedShippingRate
      })
    })
    const result = await response.json();
    if (response.ok) {
      setCheckoutCreateData(result.checkout)
      setShippingRateLoading(false)
      const selectedShipping = checkoutCreateData?.availableShippingRates.shippingRates.filter((rate) => selectedShippingRate === rate.handle)
      setShippingRateSelected(true);   
      setCtxDeliveryMethod({
        handle: selectedShipping![0].handle,
        title: selectedShipping![0].title,
        priceV2: {
          amount: selectedShipping![0].priceV2.amount,
          currencyCode: selectedShipping![0].priceV2.currencyCode
        }
      })
    }

  }


  const onPaymentMethodHandler = () => {
    console.log("payment method selected");
    setPaymentMethodLoading(true);
    
    setTimeout(() => {
      setPaymentMethodSelected(true)
      setPaymentMethodLoading(false);

    }, 1500)

  }

  const onEditShippingAddressHandler = () => {
    setShippingAddressSelected(false)
    setShippingRateSelected(false);
    setIsChecked(false);
    if (checkoutCreateData) {
      setSelectedShippingRate(checkoutCreateData?.availableShippingRates?.shippingRates[0].handle)
    }
    setError("")
    console.log("onEditShippingAddressHandler: ", userAddresses);
  }

  const onEditDeliveryMethodHandler = () => {
    // setSelectedShippingRate("");
    setShippingRateSelected(false);
  }

  const onEditPaymentMethodHandler = () => {
    setPaymentMethodSelected(false);
  }


  const onConfirmOrderHandler = async () => {
    console.log("confirm order: ", ctxPaymentMethod);
    // TODO:
    // 1. send cc info to stripe for card token
    // 2. use return card token in checkoutCompleteWithTokenizedPaymentV3 to complete checkout

    // success payment : 4242424242424242
    // failed payment: 4000000000009995
    // requires authentication: 4000002500003155

    // cc number: 4242424242424242
    // cc exp.date: 7
    // cc year: 2023
    // cvv: 123

    // const sf = new ShopifyFunctions();
    // const { response, result } =  await sf.paymentStripe(
    //   "4242424242424242",
    //   7,
    //   2023,
    //   "314"
    // );
    // if (response.ok) {
    //   console.log("result: ", result);
    //   // checkoutCompleteWithTokenizedPaymentV3
    // }


  }

  const renderCartItems = ctxCart && ctxCart?.lines?.edges?.map((product:any, k:any) => {
    return <div key={k} className="flex items-stretch justify-start 
    p-2 ring-0 ring-gray-300 mb-0 bg-white relative md:flex-col lg:flex-row">
      <div className="w-full flex items-center justify-between ring-0 ring-black
      ">
        <div className="ring-0 ring-gray-200 w-[150px] h-[150px] relative cursor-pointer group">        
          <Image 
            onClick={() => onRedirectHandler(`${getID(product.node.merchandise.product.id)}`)}
            src={product.node.merchandise.image.url}
            alt={product.node.merchandise.product.title}
            // width={product.node.merchandise.image.width}
            // height={product.node.merchandise.image.height}
            layout="fill"
            className="object-contain scale-125 group-hover:scale-150 transition-all"
          />
        </div>
        <div className="flex flex-col flex-1 ring-0 ring-black p-2 justify-between">
          <div onClick={() => onRedirectHandler(`${getID(product.node.merchandise.product.id)}`)} 
          className="flex flex-col">
              <span className="font-bold block text-lg line-clamp-1 cursor-pointer
              hover:text-sky-800
              ">
                { product.node.merchandise.product.title }
              </span>
              <span className='text-gray-600 w-full line-clamp-2'>
                { product.node.merchandise.product.description }
              </span>
              <div className="flex item-start justify-start text-xs text-gray-500 ring-0 ring-black">
                { 
                  product.node.attributes && product.node.attributes.map((attr:any, k:any) => {
                    return <div key={k} className="
                    after:content-['\00a0|\00a0'] 
                    last:after:content-[''] 
                    before:content-['\00a0']
                    first:before:content-['']
                    whitespace_normal
                    flex items-start justify-start
                    ring-0 ring-red-500  
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
      </div>
      <div className="flex flex-col items-stretch justify-between min-w-[100px] pt-3 ring-0 ring-blue-500 md:flex-row lg:flex-col">
          <div className="flex items-end justify-end font-bold">
            {product.node.merchandise.priceV2.currencyCode}{" "}
            { 
              product.node.quantity > 1 ? 
              parseFloat(String(product.node.quantity * product.node.merchandise.priceV2.amount)).toFixed(2)
              :
              parseFloat(product.node.merchandise.priceV2.amount).toFixed(2)
            }
          </div>
          <div className="flex flex-1 items-end justify-end">
            <button onClick={(e) => removeCartLineHandler(`${product.node.id}`)} className="text-whitetext-xs cursor-pointer group">
              <TrashIcon className='w-6 h-6 text-red-500 group-hover:text-primary'/>
            </button>
          </div>
      </div>
    </div>
  });

  const renderSelectedShippingAddress = shippingAddressSelected && <section className='flex items-start'>
      <h1 className="text-gray-500">Ship To:</h1>
      <div className="ml-3">
        <h2 className='font-semibold'>
          {ctxShippingInformation.firstname}{" "}{ctxShippingInformation.lastname} 
        </h2>
        <div>
        <div>{ctxShippingInformation.address1}{" "}{ctxShippingInformation.address2}</div>
        <div>{ctxShippingInformation.city}{" "}{ctxShippingInformation.zip}</div>
        <div>{ctxShippingInformation.province}{", "}{ctxShippingInformation.country.description}</div>
        </div>      
      </div>           
    </section>

  const renderSelectedShippingRate = shippingRateSelected && <section className='flex items-start'>
    <h1 className="text-gray-500">Shipping Rate:</h1>
    <div className="ml-3">
      <div>
        <div className="font-semibold">{ctxDeliveryMethod.title}</div>
        <div>
          {
            ctxDeliveryMethod.priceV2.amount === "0.0" ? 
            <span>FREE</span>
          :
            <div>
              { ctxDeliveryMethod.priceV2.currencyCode }{" "}
              { parseFloat(ctxDeliveryMethod.priceV2.amount).toFixed(2) }
            </div>
          }
          </div>
      </div>      
    </div>           
  </section>

  const renderSelectedPayment = paymentMethodSelected && <section className='flex items-start'>
    <h1 className="text-gray-500">Payment:</h1>
    <div className="ml-3">
      <div>
        <div className="font-semibold">{ctxPaymentMethod.type === "cc" ? "Credit Card" : `${ctxPaymentMethod.type.substring(0,1).toUpperCase()}${ctxPaymentMethod.type.substring(1)}`}</div>
        <div>
          { ctxPaymentMethod.info.cc }
        </div>
      </div>      
    </div>           
  </section>

  useEffect(() => {
    console.log("ctxCart:::::: ",ctxCart);
    console.log("checkoutCreateData:::::::",checkoutCreateData);
    console.log("ctxPaymentMethod:::::::", ctxPaymentMethod);
    console.log(shippingRateSelected, paymentMethodSelected);
  },[ctxCart, checkoutCreateData, ctxPaymentMethod, shippingRateSelected, paymentMethodSelected])

  return (
    <div>
      <Head>
        <title>Products Page</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        pageLoading ? <div></div> :
      
        <main className='flex flex-col items-stretch justify-between bg-slate-200 min-h-screen'>
          <Header />

          <div className="flex flex-1 flex-col  p-5 ">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex flex-col justify-between mt-10 
            md:flex-row ">
              {
                
                <>  
                  <div className="flex flex-col divide-y 
                  bg-white  p-5 rounded-xl ring-1 ring-gray-300  overflow-hidden
                  md:w-1/2 md:mr-2 ">  

                    {
                      loadingCustomer ? 
                        <Spinner  primaryColor="fill-primary" secondaryColor='text-slate-300'
                        title="Loading..." />
                      :
                      <>                  
                        <section className='text-sm space-y-2
                      md:mt-0 md:p-5 md:w-full'>
                          <div className="flex flex-row items-center justify-between 
                          md:flex-col md:items-start">
                            <h1 className="text-lg font-semibold text-primary">Contact Information</h1>
                            {
                              !auth.accessToken  &&
                              <div className="text-sm text-gray-700 md:mb-5">
                                Already have an account? {" "}
                                <button onClick={onLoginHandler} className="text-sky-800">Log in</button>
                              </div>
                            }
                          </div>

                          <InputFields type="text" title="Email Address:" id="email" name="email" placeholder="Email Address" 
                          value={ctxContactInformation.email || ""}
                          onChangeHandler={(e:any) => setCtxContactInformation(e.target.value
                          )}
                          disabled={ctxContactInformation.email ? true : false}
                          required={true}
                          />
                        </section>

                        <section className='mt-5 pt-5 text-sm space-y-2
                            md:mt-0 md:p-5 md:w-full'>
                              {
                                error ? <div className="text-red-500 mb-3">{error}</div> : ""

                              }
                              <div className="flex items-center justify-between">
                                <h1 className="text-lg font-semibold text-primary">
                                  Shipping Information{" "}
                                  <span className="text-gray-400 text-xs font-normal">(Where to deliver the package)</span>
                                </h1>
                                {
                                  shippingAddressSelected &&
                                  <PencilIcon onClick={onEditShippingAddressHandler} className="w-4 h-4 cursor-pointer
                                  hover:text-primary" />
                                }
                              </div>

                          {
                            userAddresses && userAddresses.addresses && 
                                <>
                                  
                                {
                                  shippingAddressSelected ? <div>
                                    {
                                      renderSelectedShippingAddress
                                    }
                                  </div>
                                  :
                                  <div className="">
                                    <DropdownAddress 
                                      title=""
                                      value={selectedAddressId}
                                      options={userAddresses.addresses}
                                      onChangeHandler={(e:any) => onSelectAddress(e)}
                                    />                                  
                                  </div>
                                }
                                </>
                          }
                          {
                            !shippingAddressSelected &&
                            <>
                              <div className="flex flex-col space-y-2 
                                lg:flex-row lg:space-y-0 lg:space-x-2
                              ">
                                <InputFields type="text" title="First Name:" id="firstname" name="firstname" placeholder="First Name" 
                                value={ctxShippingInformation.firstname || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation(
                                  {
                                    ...ctxShippingInformation,
                                    firstname: e.target.value
                                  }
                                )}
                                hasError={hasError}
                                required={true}
                                />
                                <InputFields type="text" title="Last Name:" id="lastname" name="lastname" placeholder="Last Name" 
                                value={ctxShippingInformation.lastname || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  lastname: e.target.value
                                })}
                                required={true}
                                hasError={hasError}
                                />
                              </div>
                              <div className="space-y-2">
                                <InputFields type="text" title="Company:" id="company" name="company" placeholder="" 
                                value={ctxShippingInformation.company || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  company: e.target.value
                                })}
                                />

                                <InputFields type="text" title="Address:" id="address1" name="address1" placeholder="" 
                                value={ctxShippingInformation.address1 || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  address1: e.target.value
                                })}
                                required={true}
                                hasError={hasError}
                                />
                                <InputFields type="text" title="Apartment#, Suite, etc." id="address2" name="address2" placeholder="" 
                                value={ctxShippingInformation.address2 || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  address2: e.target.value
                                })}
                                />
                              </div>
                              <div className="flex flex-col space-y-2 
                              lg:flex-row lg:space-y-0 lg:space-x-2
                              ">
                                <InputFields type="text" title="City:" id="city" name="city" placeholder="City" 
                                value={ctxShippingInformation.city || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  city: e.target.value
                                })}
                                required={true}
                                hasError={hasError}
                                />
                                <InputFields type="text" title="State / Province:" id="province" name="province" placeholder="State / Province" 
                                value={ctxShippingInformation.province || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  province: e.target.value
                                })}
                                required={true}
                                hasError={hasError}
                                />
                                
                              </div>
                              <div className="flex flex-col space-y-2 
                              lg:flex-row lg:space-y-0 lg:space-x-2
                              ">
                                
                                <InputFields type="text" title="Postal Code:" id="zip" name="zip" placeholder="Postal code" 
                                value={ctxShippingInformation.zip || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  zip: e.target.value
                                })}
                                required={true}
                                hasError={hasError}
                                />
                                <Dropdown 
                                  title="Country:"
                                  value={ctxShippingInformation.country.description}
                                  options={Countries as any}
                                  onChangeHandler={(e:any) => setCtxShippingInformation({
                                    ...ctxShippingInformation,
                                    country: e
                                  })}
                                />
                                
                              </div>
                              <InputFields type="text" title="Phone:" id="phone" name="phone" placeholder="Phone" 
                                value={ctxShippingInformation.phone || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  phone: e.target.value
                                })}
                              />
                              {
                                selectedAddressId === "new_address" &&
                              
                              <div className="flex items-center h-5 py-5">
                                <input onChange={(e) => setIsChecked(e.target.checked) } checked={isChecked}  id="marketing" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " />
                                <label htmlFor="marketing" className="ml-2 text-sm font-sm text-black">Save this address?</label>  
                              </div>
                              }

                            </>
                          }
                              
                          
                          {
                            !shippingAddressSelected &&                          
                            <div onClick={onShippingAddressHandler} className="flex w-full items-center justify-center  bg-sky-700 py-3 px-5 text-white rounded-lg group cursor-pointer space-x-3 ">
                              {
                                shippingInformationLoading &&
                                <Spinner  primaryColor="fill-primary" secondaryColor='text-sky-700' ringColor="text-sky-200" 
                                w="w-6" h="h-6" title="" />
                              }
                              <button className="group-hover:text-orange-200">
                                Continue to Shipping
                              </button>
                              <ChevronRightIcon className="group-hover:text-orange-200 w-4 h-4"/>
                            </div>
                          }

                        </section>
                        
                        {
                          shippingAddressSelected && 
                          <section className='mt-5 pt-5 text-sm space-y-2
                        md:mt-0 md:p-5 md:w-full'>
                            <div className="flex items-center justify-between">
                              <h1 className="text-lg font-semibold text-primary">Delivery Method</h1>
                              {
                                  shippingRateSelected &&
                                  <PencilIcon onClick={onEditDeliveryMethodHandler} className="w-4 h-4 cursor-pointer
                                  hover:text-primary" />
                                }
                            </div>
                                {
                                  shippingInformationLoading ? 
                                    <Spinner  primaryColor="fill-primary" secondaryColor='text-slate-300' title="Loading..." />
                                  :                              
                                    <div className="flex flex-col p-2 w-full space-y-2
                                      md:rounded-lg">
                                    {
                                      !shippingRateSelected && checkoutCreateData && checkoutCreateData?.availableShippingRates.shippingRates ? 
                                      
                                      checkoutCreateData.availableShippingRates.shippingRates.map((rate, idx) => {
                                        // console.log(idx);
                                        return (
                                          <div key={idx} className="flex items-center justify-between p-4 ring-1 ring-gray-200 rounded-xl
                                          group
                                          ">
                                            <InputRadio 
                                              selectedValue={selectedShippingRate}
                                              value={`${rate.handle}`}
                                              id={`${rate.handle}`}
                                              name={`shipping_rate`}
                                              title={`${rate.title}`}
                                              onChangeHandler={(e:any) => onSelectShippingRate(e.target.id) }     
                                            />
                                            <div className="flex items-center justify-end flex-shrink-0">
                                              {
                                                rate.priceV2.amount === "0.0" ? <span>FREE</span>
                                                :
                                                <span>
                                                  {rate.priceV2.currencyCode} {parseFloat(rate.priceV2.amount).toFixed(2)}
                                                </span>
                                              }
                                            </div>
                                          </div>                                          
                                        )
                                      })
                                      : 
                                      
                                        shippingRateSelected ? 
                                            renderSelectedShippingRate
                                        :                                      
                                        <div key="shopify-Economy-0.00" className="flex flex-col justify-between w-full p-3 ring-1 ring-primary rounded-lg cursor-pointer hover:ring-1 hover:ring-primary hover:bg-slate-50">
                                          <div>
                                            <h1 className="text-lg" >Economy</h1>
                                            {/* <h2 className="text-sm text-gray-500">{delivery.title}</h2> */}
                                          </div>
                                          <div className='mt-3'>
                                            FREE
                                          </div>
                                        </div>
                                      
                                    }

                                    {
                                      !shippingRateSelected &&                          
                                      <div onClick={onDeliveryMethodHandler} className="flex w-full items-center justify-center  bg-sky-700 py-3 px-5 text-white rounded-lg group cursor-pointer space-x-3 ">
                                        {
                                          shippingRateLoading &&
                                          <Spinner  primaryColor="fill-primary" secondaryColor='text-sky-700' ringColor="text-sky-200" 
                                          w="w-6" h="h-6" title="" />
                                        }
                                        <button className="group-hover:text-orange-200">
                                          Continue to Payment
                                        </button>
                                        <ChevronRightIcon className="group-hover:text-orange-200 w-4 h-4"/>
                                      </div>
                                    }

                                    </div>
                                }
                          </section>
                        }

                        {
                          shippingRateSelected && !paymentMethodSelected ? 
                          <section className='mt-5 pt-5 text-sm space-y-2 md:mt-0 md:p-5 md:w-full'>
                            <div className="flex items-center justify-between">
                              <h1 className="text-lg font-semibold text-primary">Payment Method</h1>
                              {
                                paymentMethodSelected &&
                                <PencilIcon onClick={onEditPaymentMethodHandler} className="w-4 h-4 cursor-pointer
                                hover:text-primary" />
                              }
                            </div>
                            <div className="flex flex-col p-2 w-full space-y-2 md:rounded-lg">
                              <div className="flex flex-col items-center justify-between p-4 ring-1 ring-gray-200 rounded-xl group">
                                <InputRadio 
                                  selectedValue={selectedPaymentMethod}
                                  value={`cc`}
                                  id={`pm_cc`}
                                  name={`payment_method`}
                                  title={`Credit Card`}
                                  onChangeHandler={(e:any) => onSelectPaymentMethod("cc") }     
                                />       
                                {
                                  selectedPaymentMethod === "cc" ?
                                  <div className="w-full space-y-5 p-5 ring-0 ring-gray-500">
                                    <div>
                                      <InputFields type="text" title="Card Number" id="cc" name="cc" placeholder="" 
                                      value={ctxPaymentMethod.info.cc || ""}
                                      onChangeHandler={(e:any) => setCtxPaymentMethod(
                                        {
                                          ...ctxPaymentMethod,
                                          info: {
                                            ...ctxPaymentMethod.info,
                                            cc: e.target.value
                                          }
                                        }
                                      )}
                                      hasError={hasError}
                                      required={true}
                                      />
                                    </div>
                                    <div>
                                      <InputFields type="text" title="Name on Card" id="nameoncc" name="nameoncc" placeholder="" 
                                      value={ctxPaymentMethod.info.nameoncc || ""}
                                      onChangeHandler={(e:any) => setCtxPaymentMethod(
                                        {
                                          ...ctxPaymentMethod,
                                          info: {
                                            ...ctxPaymentMethod.info,
                                            nameoncc: e.target.value
                                          }
                                        }
                                      )}
                                      hasError={hasError}
                                      required={true}
                                      />
                                    </div>
                                    <div className='flex space-x-5 ring-0 ring-gray-500 items-center justify-between md:flex-col md:space-x-0 md:space-y-5'>
                                      <div className='w-1/2 ring-0 ring-red-500 md:w-full'>
                                        <InputFields type="text" title="Exp.Date" id="expdate" name="expdate" placeholder="" 
                                        value={ctxPaymentMethod.info.expdate || ""}
                                        onChangeHandler={(e:any) => setCtxPaymentMethod(
                                          {
                                            ...ctxPaymentMethod,
                                            info: {
                                              ...ctxPaymentMethod.info,
                                              expdate: e.target.value
                                            }
                                          }
                                        )}
                                        hasError={hasError}
                                        required={true}
                                        />
                                      </div>
                                      <div className='w-1/2 ring-0 ring-blue-500 md:w-full'>
                                        <InputFields type="text" title="CVV" id="cvv" name="cvv" placeholder="" 
                                          value={ctxPaymentMethod.info.cvv || ""}
                                          onChangeHandler={(e:any) => setCtxPaymentMethod(
                                            {
                                              ...ctxPaymentMethod,
                                              info: {
                                                ...ctxPaymentMethod.info,
                                                cvv: e.target.value
                                              }
                                            }
                                          )}
                                          hasError={hasError}
                                          required={true}
                                          />
                                      </div>

                                    </div>
                                  </div>
                                  : ""
                                }                         
                              </div>
                              
                              <div className="flex items-center justify-between p-4 ring-1 ring-gray-200 rounded-xl group">
                                <InputRadio 
                                    selectedValue={selectedPaymentMethod}
                                    value={`paypal`}
                                    id={`pm_paypal`}
                                    name={`payment_method`}
                                    title={`Paypal`}
                                    onChangeHandler={(e:any) => onSelectPaymentMethod("paypal") }     
                                />
                              </div>
                            </div>
                              
                            
                            {
                              !paymentMethodSelected &&                          
                              <div onClick={onPaymentMethodHandler} className="flex w-full items-center justify-center  bg-sky-700 py-3 px-5 text-white rounded-lg group cursor-pointer space-x-3 ">
                                {
                                  paymentMethodLoading &&
                                  <Spinner  primaryColor="fill-primary" secondaryColor='text-sky-700' ringColor="text-sky-200" 
                                  w="w-6" h="h-6" title="" />
                                }
                                <button className="group-hover:text-orange-200">
                                  Select Payment
                                </button>
                                <ChevronRightIcon className="group-hover:text-orange-200 w-4 h-4"/>
                              </div>
                            }

                          </section>
                          : 
                          
                            paymentMethodSelected &&                          
                            <section className='mt-5 pt-5 text-sm space-y-2 md:mt-0 md:p-5 md:w-full'>
                            <div className="flex items-center justify-between">
                              <h1 className="text-lg font-semibold text-primary">Payment Method</h1>
                              {
                                paymentMethodSelected &&
                                <PencilIcon onClick={onEditPaymentMethodHandler} className="w-4 h-4 cursor-pointer
                                hover:text-primary" />
                              }
                            </div>
                            { renderSelectedPayment }
                            </section>
                          
                        }
                        
                        
                      </>
                    }

                  </div>

                  <div className='mt-5 text-sm space-y-2 bg-white p-5 rounded-xl ring-1 ring-gray-300
                  md:mt-0 md:p-5 md:w-1/2'>
                    <h1 className="text-lg font-semibold">Order Summary</h1>
                    <div className="flex flex-col divide-y divide-gray-200
                    after:border-b
                    after:border-gray-200
                    after:mb-5
                    ">
                      { 
                      ctxCart.lines && ctxCart.lines.edges!.length > 0 ? 
                      
                      renderCartItems 

                      : 
                      // loadingCart ? <Spinner  primaryColor="fill-primary" secondaryColor='text-slate-300'
                      // title="Loading..." /> :
                      <div>No items in shopping cart</div>  
                      }          
                  </div>
                  {/* {
                    !loadingCart && */}
                    <>
                      <div className="flex items-center justify-between">
                        <span>Subtotal:</span>
                        <span>{

                          checkoutCreateData?.subtotalPriceV2 ? <>
                          {checkoutCreateData?.subtotalPriceV2.currencyCode}{" "}
                          {parseFloat(checkoutCreateData?.subtotalPriceV2.amount).toFixed(2)}
                          </> 
                          :
                          ctxCart?.estimatedCost?.subtotalAmount ? 
                          `${ctxCart?.estimatedCost?.subtotalAmount?.currencyCode} ${parseFloat(ctxCart?.estimatedCost?.subtotalAmount?.amount!).toFixed(2)}` : "-"

                          }
                          </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount:</span>
                        <div>
                          Apply
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Shipping:</span>
                        <span>
                          {
                            shippingAddressSelected && 
                            shippingRateSelected &&
                            checkoutCreateData?.shippingLine ? <>
                              {checkoutCreateData?.shippingLine.priceV2.currencyCode}{" "}
                              {parseFloat(checkoutCreateData?.shippingLine.priceV2.amount).toFixed(2)}
                            </> : "-"
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tax:</span>
                        <span>{
                          checkoutCreateData?.totalTaxV2 ? <>
                          {checkoutCreateData?.totalTaxV2.currencyCode}{" "}
                          {parseFloat(checkoutCreateData?.totalTaxV2.amount).toFixed(2)}
                          </> 
                          :
                          ctxCart?.estimatedCost?.totalTaxAmount ? `${ctxCart.estimatedCost?.totalTaxAmount?.currencyCode} ${parseFloat(ctxCart.estimatedCost?.totalTaxAmount?.amount!).toFixed(2)}` : "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t-2 border-black pt-2 text-sky-900">
                        <span className="text-lg font-bold">Order Total:</span>
                        <span className="text-lg font-bold">
                          {
                            checkoutCreateData?.totalPriceV2 ? 
                            <>
                              {checkoutCreateData?.totalPriceV2.currencyCode}{" "}
                              {parseFloat(checkoutCreateData?.totalPriceV2.amount).toFixed(2)}
                            </> 
                            :
                            ctxCart?.estimatedCost?.totalAmount ? 
                            `${ctxCart?.estimatedCost?.totalAmount?.currencyCode} ${parseFloat(ctxCart?.estimatedCost?.totalAmount?.amount!).toFixed(2)}` : "-"
                          }
                        </span>
                      </div>
                      
                      {
                        shippingAddressSelected && shippingRateSelected && paymentMethodSelected ?
                      
                      <div onClick={onConfirmOrderHandler} className="flex items-center justify-center w-full bg-sky-700 py-3 px-5 text-white rounded-lg cursor-pointer mt-6 hover:text-orange-200">
                        Confirm Order
                      </div>
                      : 
                      <div className="flex items-center justify-center w-full bg-gray-500 py-3 px-5 text-white rounded-lg cursor-pointer mt-6">
                        Confirm Order
                      </div>
                      }
                      
                      <div className="text-xs text-gray-500">
                        
                      </div>
                    </>
                  {/* } */}

                  </div>            
                </>
              }
            </div>          
          </div>

          <Footer />
        </main>
      }
    </div>
  )
}

export default Checkout;


// ctxCart
// {
//   "id": "",
//   "estimatedCost": {
//       "subtotalAmount": {
//           "amount": "",
//           "currencyCode": ""
//       },
//       "totalAmount": {
//           "amount": "",
//           "currencyCode": ""
//       },
//       "totalDutyAmount": {
//           "amount": "",
//           "currencyCode": ""
//       },
//       "totalTaxAmount": {
//           "amount": "",
//           "currencyCode": ""
//       }
//   },
//   "lines": {
//       "edges": [
//           {
//               "id": "",
//               "attributes": [
//                   {
//                       "key": "",
//                       "value": ""
//                   }
//               ],
//               "estimatedCost": {
//                   "subtotalAmount": null,
//                   "totalAmount": null,
//                   "totalDutyAmount": null,
//                   "totalTaxAmount": null
//               },
//               "quantity": 0,
//               "merchandise": {
//                   "id": "",
//                   "title": "",
//                   "quantityAvailable": 0,
//                   "image": {
//                       "url": "",
//                       "width": 0,
//                       "height": 0
//                   },
//                   "priceV2": {
//                       "amount": "0.00",
//                       "currencyCode": "USD"
//                   },
//                   "product": {
//                       "id": "",
//                       "title": "",
//                       "description": ""
//                   }
//               }
//           }
//       ],
//       "pageInfo": {
//           "endCursor": "",
//           "startCursor": "",
//           "hasNextPage": false,
//           "hasPreviousPage": false
//       }
//   }
// }