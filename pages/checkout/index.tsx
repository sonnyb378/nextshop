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

const Checkout = (props: any) => {
  const cart = useAppSelector(selectCart);
  const profile = useAppSelector(selectProfile);
  const auth = useAppSelector(selectAuth)
  const checkout = useAppSelector(selectCheckout);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ pageLoading, setPageLoading] = useState(true);

  const [shippingInformationLoading, setShippingInformationLoading] = useState(false);
  const [deliveryMethodLoading, setDeliveryMethodLoading] = useState(false);
  const [paymentMethodLoading, setPaymentMethodLoading] = useState(false);

  const [shippingAddressSelected, setShippingAddressSelected] = useState(false);
  const [deliveryMethodSelected, setDeliveryMethodSelected] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [allowConfirmOrder, setAllowConfirmOrder] = useState(false);

  const { 
    cart: ctxCart, 
    contactInformation: ctxContactInformation, 
    shippingInformation: ctxShippingInformation,
    deliveryMethod: ctxDliveryMethod,
    paymentMethod: ctxPaymentMethod
  } = useAppContext();

  const { 
    setCtxCart,
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
  const [selectedAddressText, setSelectedAddressText] = useState("");
  const [isChecked, setIsChecked] = useState(true)


  useEffect(() => {   
    const getCustomer = async () => {
      if (auth.accessToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer/${auth.accessToken}`)
        const result = await response.json();
        // console.log("--> ",result, response.ok);
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

            // console.log("default address: ", defaultAddress);
            setCtxContactInformation(profile?.email!)
            if (defaultAddress) {
              const addressLine = `${defaultAddress![0].node.address1 && defaultAddress![0].node.address1} ${defaultAddress![0].node.address2 && `, ${defaultAddress![0].node.address2}`} ${defaultAddress![0].node.city && defaultAddress![0].node.city} ${defaultAddress![0].node.province && defaultAddress![0].node.provinceCode} ${defaultAddress![0].node.zip && defaultAddress![0].node.zip} ${defaultAddress![0].node.country && defaultAddress![0].node.countryCodeV2} (${defaultAddress![0].node.firstName && defaultAddress![0].node.firstName} ${defaultAddress![0].node.lastName && defaultAddress![0].node.lastName})`;

              setSelectedAddressText(addressLine)
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


  const removeCartLineHandler = async (lineId: string) => {
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/line`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables: {
          cartId: cart.cartId,
          lineIds: [
            lineId
          ]
        }
      })
    })
    const removeResult = await response.json();
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
        // setCartItems(removeResult?.cartLinesRemove?.cart?.lines?.edges!);
        // setCartCost(removeResult?.cartLinesRemove?.cart.estimatedCost);
        setCtxCart(
          {
            id: removeResult.cartLinesRemove.cart.id, 
            estimatedCost: removeResult.cartLinesRemove.cart.estimatedCost,
            lines: removeResult.cartLinesRemove?.cart?.lines
          }
        )
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/cart/line`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables: variables
      })
    })
    const updateResult = await response.json();
    if (response.ok) {
      // console.log("updateResult: ", updateResult);
      if (updateResult) {
        let itemcount = 0
        updateResult.cartLinesUpdate.cart.lines.edges.forEach((line:any) => {
          itemcount += line.node.quantity;
        })
        dispatch(setCartData({ 
          cartId: updateResult.cartLinesUpdate.cart.id, 
          itemsCount: itemcount
        }))
        // setCartItems(updateResult?.cartLinesUpdate?.cart?.lines?.edges!);
        // setCartCost(updateResult?.cartLinesUpdate?.cart.estimatedCost);
        setCtxCart(
          {
            id: updateResult.cartLinesUpdate.cart.id, 
            estimatedCost: updateResult.cartLinesUpdate.cart.estimatedCost,
            lines: updateResult?.cartLinesUpdate?.cart?.lines
          }
        )
      }
    }

  }

  const onSelectAddress = (e:any) => {
    // console.log("selected address: ", e);

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
      setSelectedAddressText("");
    } else {
      setSelectedAddressId(e);
      const selected = userAddresses?.addresses?.filter(address => e === address.node.id)
  
      const addressLine = `${selected![0].node.address1 && selected![0].node.address1} ${selected![0].node.address2 && `, ${selected![0].node.address2}`} ${selected![0].node.city && selected![0].node.city} ${selected![0].node.province && selected![0].node.provinceCode} ${selected![0].node.zip && selected![0].node.zip} ${selected![0].node.country && selected![0].node.countryCodeV2} (${selected![0].node.firstName && selected![0].node.firstName} ${selected![0].node.lastName && selected![0].node.lastName})`;
      setSelectedAddressText(addressLine);

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
    }

  }


  const onRedirectHandler = (id:string) => {
    router.push(`/products/${id}`)
  }

  // console.log(cartItems);

  const onLoginHandler = () => {
    router.push('/auth/signin?redirect=checkout')
  }

  // console.log("formState", formState);

  const onShippingAddressHandler = async () => {
    setShippingInformationLoading(true);
    
    console.log("send checkoutCreate");   

    const addressShipping = {
      address1: ctxShippingInformation.address1,
      address2: ctxShippingInformation.address2,
      city: ctxShippingInformation.city,
      company: ctxShippingInformation.company,
      country: ctxShippingInformation.country.description,
      firstName: ctxShippingInformation.firstname,
      lastName: ctxShippingInformation.lastname,
      phone: ctxShippingInformation.phone,
      province: ctxShippingInformation.province,
      zip: ctxShippingInformation.zip
    }

    if (checkout.checkoutId) {
      // checkoutShippingAddressUpdateV2
      const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          checkoutId: checkout.checkoutId,
          shippingAddress: addressShipping
        })
      })
      const result = await response.json();
      if (response.ok) {
        console.log("update address: ", result);
        setShippingInformationLoading(false);
        setShippingAddressSelected(true)
        dispatch(setCheckoutData({
          checkoutId: result.checkout.id,
          webUrl: result.checkout.webUrl
        }))
      }


    } else {
      // checkoutCreate
      const variants = ctxCart.lines?.edges?.map((variant:any) => {
        const attributes = variant.node.attributes.map((attr:any) => {
          return { key: attr.key, value:attr.value}
        });
        return {
          customAttributes: attributes,
          variantId: variant.node.merchandise.id,
          quantity: variant.node.quantity
        }
      })
      const inputVars = {
        email: ctxContactInformation.email,
        buyerIdentity: {
          countryCode: ctxShippingInformation.country.name,
        },
        lineItems: variants,
        shippingAddress: addressShipping
      }
      
      console.log("inputVars: ", inputVars)

      const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputVariables: inputVars,
          queueToken: ""
        })
      })
      const result = await response.json();
      if (response.ok) {      
        if (!checkout.checkoutId) {
          setShippingInformationLoading(false);
          setShippingAddressSelected(true)
          dispatch(setCheckoutData({
            checkoutId: result.checkout.id,
            webUrl: result.checkout.webUrl
          }))
        }
      }
    }
    

  }

  // const onDeliveryMethodHandler = () => {
  //   console.log("delivery method selected");
  //   setDeliveryMethodLoading(true);
  //   setTimeout(() => {
  //     setDeliveryMethodSelected(true)
  //     setDeliveryMethodLoading(false);
  //   }, 1500)
  // }

  // const onPaymentMethodHandler = () => {
  //   console.log("payment method selected");
  //   setPaymentMethodLoading(true);
  //   setTimeout(() => {
  //     setPaymentMethodSelected(true)
  //     setPaymentMethodLoading(false);
  //   }, 1500)
  // }

  const onEditShippingAddressHandler = () => {
    setShippingAddressSelected(false)
  }

  // const onEditDeliveryMethodHandler = () => {
  //   setDeliveryMethodSelected(false);
  // }

  // const onEditPaymentMethodHandler = () => {
  //   setPaymentMethodSelected(false);
  // }


  const onConfirmOrderHandler = () => {
    console.log("confirm order");
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
        <h2 className=''>
          {ctxShippingInformation.firstname}{" "}{ctxShippingInformation.lastname} 
        </h2>
        <div>
        <div>{ctxShippingInformation.address1}{" "}{ctxShippingInformation.address2}</div>
        <div>{ctxShippingInformation.city}{" "}{ctxShippingInformation.zip}</div>
        <div>{ctxShippingInformation.province}{", "}{ctxShippingInformation.country.description}</div>
        </div>      
      </div>           
    </section>

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
                          />
                        </section>

                        <section className='mt-5 pt-5 text-sm space-y-2
                            md:mt-0 md:p-5 md:w-full'>
                              <div className="flex items-center justify-between">
                                <h1 className="text-lg font-semibold text-primary">Shipping Address</h1>
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
                                  !shippingAddressSelected && 
                                
                                  <div className="">
                                    <DropdownAddress 
                                      title=""
                                      value={selectedAddressId}
                                      options={userAddresses.addresses}
                                      onChangeHandler={(e:any) => onSelectAddress(e)}
                                    />
                                  
                                  </div>
                                }
                                {
                                  shippingAddressSelected && <div>
                                    {
                                      renderSelectedShippingAddress
                                    }
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
                                />
                                <InputFields type="text" title="Last Name:" id="lastname" name="lastname" placeholder="Last Name" 
                                value={ctxShippingInformation.lastname || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  lastname: e.target.value
                                })}
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
                                />
                                <InputFields type="text" title="State / Province:" id="province" name="province" placeholder="State / Province" 
                                value={ctxShippingInformation.province || ""}
                                onChangeHandler={(e:any) => setCtxShippingInformation({
                                  ...ctxShippingInformation,
                                  province: e.target.value
                                })}
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

                              <div className="flex items-center h-5 py-5">
                                <input onChange={(e) => setIsChecked(e.target.checked) } checked={isChecked}  id="marketing" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " />
                                <label htmlFor="marketing" className="ml-2 text-sm font-sm text-black">Save this address?</label>  
                              </div>
                              

                            </>
                          }
                              
                          
                          {
                            !shippingAddressSelected &&                          
                            <div onClick={onShippingAddressHandler} className="flex w-full items-center justify-center  bg-sky-700 py-3 px-5 text-white rounded-lg group cursor-pointer space-x-3">
                              {
                                shippingInformationLoading &&
                                <Spinner  primaryColor="fill-primary" secondaryColor='text-sky-700' ringColor="text-sky-200" 
                                w="w-6" h="h-6" title="" />
                              }
                              <button className="group-hover:text-orange-200">
                                I want to use this address
                              </button>
                              <ChevronRightIcon className="group-hover:text-orange-200 w-4 h-4"/>
                            </div>
                          }

                        </section>
                        
                      
                        <section className='mt-5 pt-5 text-sm space-y-2
                      md:mt-0 md:p-5 md:w-full'>
                          <div className="flex items-center justify-between">
                                <h1 className="text-lg font-semibold text-primary">Delivery Method</h1>
                                
                              </div>
                          
                          <div className="flex space-x-2 p-2 w-full
                          md:flex-row md:rounded-lg">
                          {
                            deliveryMethod && deliveryMethod.map((delivery) => {
                              return (
                                <div key={delivery.id} className="flex flex-col justify-between w-full p-3 ring-1 ring-gray-200 rounded-lg cursor-pointer hover:ring-1 hover:ring-primary hover:bg-slate-50">
                                  <div>
                                    <h1 className="text-lg" >{delivery.title}</h1>
                                    <h2 className="text-sm text-gray-500">{delivery.subtitle}</h2>
                                  </div>
                                  <div className='mt-3'>
                                    {delivery.price.currencyCode}{" "}{parseFloat(delivery.price.amount).toFixed(2)}
                                  </div>
                                </div>
                              )
                            })
                          }
                          </div>
                          
                        </section>
                      
                        <section className='mt-5 pt-5 text-sm space-y-2
                      md:mt-0 md:p-5 md:w-full'>
                          <div className="flex items-center justify-between">
                                <h1 className="text-lg font-semibold text-primary">Payment Method</h1>
                               
                              </div>
                          <div>
                            Credit Card
                          </div>
                          <div>
                            Paypal
                          </div>

                         

                        </section>
                        
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
                      ctxCart.lines && ctxCart.lines.edges!.length > 0 ? renderCartItems : 
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
                        <span>{ctxCart?.estimatedCost?.subtotalAmount ? ctxCart?.estimatedCost?.subtotalAmount?.currencyCode : ""} 
                        {" "}
                        {ctxCart?.estimatedCost?.subtotalAmount ? parseFloat(ctxCart?.estimatedCost?.subtotalAmount?.amount!).toFixed(2) : "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Shipping Estimate:</span>
                        <span>-</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tax Estimate:</span>
                        <span>{ctxCart?.estimatedCost?.totalTaxAmount ? ctxCart.estimatedCost?.totalTaxAmount?.currencyCode:""}
                        {" "}
                        {ctxCart?.estimatedCost?.totalTaxAmount ? parseFloat(ctxCart.estimatedCost?.totalTaxAmount?.amount!).toFixed(2) : "-"}</span>
                      </div>
                      <div className="flex items-center justify-between border-t-2 border-black pt-2 text-sky-900">
                        <span className="text-lg font-bold">Order Total:</span>
                        <span className="text-lg font-bold">{ctxCart?.estimatedCost?.totalAmount ? ctxCart?.estimatedCost?.totalAmount?.currencyCode : ""}{" "} 
                        {
                        ctxCart?.estimatedCost?.totalAmount ? parseFloat(ctxCart?.estimatedCost?.totalAmount?.amount!).toFixed(2) : "-"}</span>
                      </div>
                      
                      {
                        allowConfirmOrder ?
                      
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