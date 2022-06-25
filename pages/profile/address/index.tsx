import React, { useCallback, useEffect, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import auth, { selectAuth } from '../../../app/store/slices/auth'
import { gql, useQuery } from '@apollo/client'

import { selectProfile, setProfileData } from '../../../app/store/slices/profile'
import { setAuthData } from '../../../app/store/slices/auth'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Spinner from '../../../components/Spinner'
import client from '../../../utils/apolloClient'

import ProfileSidebar from '../../../components/ProfileSidebar'
import PageHeader from '../../../components/profilepage/PageHeader'
import PageTemplate from '../../../components/profilepage/PageTemplate'
import PageContent from '../../../components/profilepage/PageContent'

import { PencilIcon, TrashIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import AddAddressForm from '../../../components/profilepage/AddAddressForm'
import { useAppSelector } from '../../../app/hooks'
import { wrapper } from '../../../app/store'

import { IAddressStruct, IUserAddress, IAddress } from '../../../ts/profile/addresses/address'

const GET_CUSTOMER_ADDRESS = gql`
  query getCustomerAddress($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        id
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            provinceCode
            zip
            countryCodeV2
            country
            latitude
            longitude
          }
        }
      }
    }
  }
`;


const  Address: NextPage = (props: any) => {
  const [pageLoading, setPageLoading ] = useState(true);
  // const dispatch = useDispatch();
  const auth = useAppSelector(selectAuth); //useSelector(selectAuth);
  const router = useRouter();

  const [removeAddress, setRemoveAddress] = useState<IAddressStruct>({
    isOpen: false,
    addressId: null,
    address: null
  })

  const [userAddresses, setUserAddresses] = useState<IUserAddress>({ 
    defaultAddress: null, 
    addresses:null
  })

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/auth/signin")
    } else {
      setPageLoading(false)
    }
  },[auth.accessToken, router])

  useEffect(() => {   
    const getCustomer = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer/${auth.accessToken}`)
      const result = await response.json();
      // console.log("--> ",result, response.ok);
      if (response.ok) {
        setUserAddresses({
          defaultAddress: result?.customer?.defaultAddress, 
          addresses: result?.customer?.addresses?.edges
        });
      }
    }
    getCustomer();
  },[auth.accessToken])

  const setAddressDeletion = (values: {
    isOpen: boolean
    addressId: string
    address: string
  }) => {
    setRemoveAddress({
      isOpen: values.isOpen,
      addressId: values.addressId,
      address: values.address
    })
  }

  const deleteAddressHandler = async (id: string) => {
    // console.log("delete address with id: ", id);
    setRemoveAddress({
      isOpen: false,
      addressId: null,
      address: null
    })
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/address`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        addressId: id,
        accessToken: auth.accessToken
      })
    })
    const result = await response.json();
    // console.log("delete address: ", result.customerAddressDelete.deletedCustomerAddressId);
    if (response.ok) {      
      // refetch()
      // getCustomer();
      const newAddresses = userAddresses?.addresses?.filter((address) => {
        return result.customerAddressDelete.deletedCustomerAddressId !== address.node.id;
      }) as IAddress[]

      // console.log("newAddresses: ", newAddresses);
      setUserAddresses((prev:any) => {
        return {
          ...prev,
          addresses: newAddresses
        }
      })
    }

  }

  const setDefaultAddressHandler = async (id:string) => {
    // console.log("default address: ", id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/address/setdefault`, {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        addressId: id,
        accessToken: auth.accessToken
      })
    })
    const result = await response.json();
    // console.log("set default: ", result?.customerDefaultAddressUpdate?.customer?.defaultAddress);
    // console.log("userAddresses: ", userAddresses);
    if (response.ok) {
      // refetch();
      // getCustomer()
      setUserAddresses((prev) => {
        return {
          ...prev,
          defaultAddress: {
            country: result?.customerDefaultAddressUpdate?.customer?.defaultAddress.country,
            countryCodeV2: result?.customerDefaultAddressUpdate?.customer?.countryCodeV2,
            id: result?.customerDefaultAddressUpdate?.customer?.defaultAddress.id
          },
          addresses: result?.customerDefaultAddressUpdate?.customer?.addresses.edges
        }
      })
    }
  }

  // console.log("2 userAddresses: ", userAddresses)

  return (
        
        <div className='bg-black'>
          <Head>
              <title>TEMPLATE - Addresses</title>
              <meta name="description" content="The Next Online Shop" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            
          {
            pageLoading ? <div></div>
            :            
            <PageTemplate objAddress={removeAddress} setOpenHandler={setRemoveAddress} deleteAddressHandler={deleteAddressHandler}>
              
              <PageHeader title="Address" subtitle="You can save multiple addresses">
                <div>
                  <Link href="/profile/address/create">
                    <button className="bg-sky-700 text-xs text-white py-2 px-5 rounded-2xl hover:text-orange-200 hover:ring-offset-1 hover:ring-1">
                      Add Address
                    </button>
                  </Link>
                </div>
              </PageHeader>
              <PageContent>
                {
                  userAddresses.addresses && userAddresses?.addresses?.length <= 0 ?<div>No customer addresses found</div> 
                : 
                <div className="">
                  <div className="hidden p-5 ring-1 ring-gray-500 bg-gray-300 
                  md:flex md:p-0">
                    <div className="flex flex-col items-center justify-between w-full
                          md:flex-row md:font-bold">
                            <div className="w-full ring-0 md:p-5">Address</div>
                            <div className="w-full ring-0 md:py-5 md:hidden">Address2</div>
                            <div className="flex items-center justify-start w-full space-x-2 ring-0 md:py-5 md:hidden">
                              <div>City</div>
                              <div>Zip</div>
                              <div>Country</div>  
                            </div>
                          </div>
                          <div className='flex items-start justify-center w-[120px] flex-1 space-x-1 text-mdtext-sky-800 md:p-5 md:font-bold'>Action
                          </div>
                  </div>
                  
                  {
                    userAddresses?.addresses && userAddresses?.addresses.map((address:any, k:any)=> {
                      const { firstName, lastName, company, address1, address2, city, country, countryCodeV2, id, latitude, longitude, province, provinceCode, zip} = address.node
                      // console.log("da: ", userAddresses?.defaultAddress?.id);
                      // console.log("aa: ",id);
                      
                      return (
                        

                        <div id={`address_${id}`} key={k} className={`flex items-stretch justify-center w-full  rounded-xl mb-2 p-4 text-md ring-1 ring-gray-300                        
                        md:mb-0 md:ring-1 md:rounded-none md:item-stretch md:p-0`}>                         
                          <div className="flex flex-col items-start justify-between w-full text-md
                          md:items-center md:flex-row md:text-sm">
                            <div className="w-full ring-0 md:p-5 md:w-max">
                            {firstName ? `${firstName}` : ``}
                            {lastName ? ` ${lastName}` : ``}

                            {firstName || lastName ? `, ${address1}` : `${address1}`}
                            {address2 ? `, ${address2}` : ``}</div>
                            <div className="flex items-center justify-start w-full space-x-2 ring-0 md:py-5 md:flex-1">
                              {
                                city && <div>{city}</div>    
                              }
                              {
                                zip && <div>{zip}</div>
                              }
                              {
                                provinceCode && <div>{provinceCode}</div>
                              }
                              {
                                country && <div>{country}</div>  
                              }
                            </div>
                            {
                              userAddresses?.defaultAddress?.id === id ? 
                              <div className="bg-primary text-white text-xs py-2 px-3 rounded-lg mr-2">
                                Default
                              </div> 
                              : 
                              <div onClick={setDefaultAddressHandler.bind(this, id)} className="py-2 px-5 bg-sky-800 cursor-pointer text-white text-xs rounded-lg mr-2 hover:text-yellow-500">
                                Set as Default
                              </div>
                            }
                          </div>
                          
                          <div className='flex items-start justify-center w-[220px] flex-1 space-x-1 text-sky-800 md:p-3 md:grow md:items-center'>
                            
                            <PencilIcon className="w-6 h-6"/>
                            {
                              // userAddresses?.defaultAddress?.id !== id ? 
                              <TrashIcon onClick={setAddressDeletion.bind(this, {
                                isOpen: true,
                                addressId: id,
                                address: `${address1 && address1} ${address2 && `, ${address2}`}
                                ${city && city} ${zip && zip} ${country && country} `
                              }) } className="w-6 h-6  cursor-pointer md:hover:text-yellow-700" />
                              // : ""
                            }
                            
                          </div>
                        </div>                        
                        
                      )
                    })
                    
                  }
                  
                </div>
                }
              </PageContent>
            </PageTemplate>
          }
        
      </div>
    
  )
}

export default Address


// export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
//   (store) => 
//     async(context) => {

//      const state = store.getState();
//      console.log("server side getState: ", state);

//       return {
//         props: {
          
//         }
//       }
//     }
// )



// mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
//   customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
//     customerUserErrors {
//       code, field, message
//     }
//     deletedCustomerAddressId
//   }
// }

// {
//   "id": "gid://shopify/MailingAddress/6609131471054?model_name=CustomerAddress&customer_access_token=j0UcCLwc89nhj_Rwp0YuOrVnRrHD3oSMkG7yuF_MBe2EG4zfUjTGVnPoU2WkR0DYk8D91njLtR_cC-AuOWxCOcwtK1K1S6yp2S-zOdZSYQhuulYZKU_jLGrRzU6fC1lznGawVwG0IQracJpad4l4W9eTwS7GQK7tB53_Ul00AUHc_EgdXd0-bUZcpw9reeWKQfVAYrYbOTZowg6-o-22DnT6u-_9qPMKw22KPrJ-9kSzWZ1BBvLMiq9G2flFZAiJ",
//   "customerAccessToken": "a86dd9808c274ff26d5ed1f432b15af8"
// }

//response:
// {
//   "data": {
//     "customerAddressDelete": {
//       "customerUserErrors": [],
//       "deletedCustomerAddressId": "gid://shopify/MailingAddress/6609149821134?model_name=CustomerAddress&customer_access_token=naG4AysjgPCP1DebyEdyWQkPTt0-4EuM_ZUaL4yP3mKchCAtOu8VpYl9Y7OL6rbI8DACHkfxnF_f6BX_GWJ4zUhzNhIKQe3EreUE8axeZrPCwbpaObyrmw9BNJfug4tcCkQmnOlvTgHyjrYmxmj4e_YvfLMiDZuTOYgJC_yut9pN8s700st8v1_7fM9_Tc64Uu24SWpeTl5hq4ul7JCN1Y3YoKL106IXUNDTmQO9Pt-0iMbbqzYXoTY7hMX4yFmN"
//     }
//   }
// }



// query getCustomerAddress($customerAccessToken: String!) {
//   customer(customerAccessToken: $customerAccessToken) {
//     defaultAddress {
//       id
//     }
//     addresses(first: 10) {
//       edges {
//         node {
//           id
//           address1
//           address2
//           city
//           province
//           provinceCode
//           zip
//           countryCodeV2
//           country
//           latitude
//           longitude
//         }
//       }
//     }
//   }
// }
// {
//   "customerAccessToken":"a86dd9808c274ff26d5ed1f432b15af8"
// }


// mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
//   customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
//     customer {
//       id
//       email
//       firstName
//       lastName
//       defaultAddress {
//         id
//         address1
//         address2
//         city
//         province
//         provinceCode
//         zip
//         countryCodeV2
//         country
//       }
//     }
//     customerUserErrors {
//       code, field, message
//     }
//   }
// }
// {
//   "id": "gid://shopify/MailingAddress/6609131471054?model_name=CustomerAddress&customer_access_token=qGVGtdO8EzlyvR5-IT6DR6ydalF887Qph4RYKV5TFA9MofCM4swvJp5OCgNUppsr58EypzMKr4iG4Pwo2p7qP5zAyUUhmQw0V6Hvj3BlwfS8BKu6iQRsPNFLshW7el20GQ15VLCfJ-g0iekdMSYTAWhXsPwW3S9t-qW94VLqOqGsjwCt18lclpqekBBwdA3hi16xfZMnFOQ3VgYAZSnjQGGxpGSwWhTDmig9xJHuof5RmrGKZENoF_T7fV4ijyup"
// }
//response
// {
//   "data": {
//     "customerDefaultAddressUpdate": {
//       "customer": {
//         "id": "gid://shopify/Customer/5419446042830",
//         "email": "pasayfolks@gmail.com",
//         "firstName": "Sonny",
//         "lastName": "Baga III",
//         "defaultAddress": {
//           "id": "gid://shopify/MailingAddress/6611224559822?model_name=CustomerAddress&customer_access_token=hhyyAvAxcjvidzo2NOvuqmyMUrBTUbDcJaOdvaLzLSzKDngzGdlao0oqCNNl0usU-IQS0U1m2HsCqd7a5s5Ma2SiBnS93hTTc_vSi9v7ttHQ3VWMgFGLARRHZaYYVXQks5sJfMB6P1GALWGaJcAwPxouWt7MQ-mkZMl8SPx7Kt9nWhB5wFodl9YHBXtchyaZN5xn4Y-P5pVkSbuZN5fc7HZU6yBoXlJYjH3hHAfYeNdnzGcWu4lMU3bcsNO0LZqI",
//           "address1": "9812 alksdhfkadf",
//           "address2": "unit 123",
//           "city": "aksdjflkasdf",
//           "province": "California",
//           "provinceCode": "CA",
//           "zip": "12390",
//           "countryCodeV2": "US",
//           "country": "United States"
//         }
//       },
//       "customerUserErrors": []
//     }
//   }
// }

