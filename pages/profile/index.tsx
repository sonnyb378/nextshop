import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { selectAuth } from '../../app/store/slices/auth'
import { gql, useQuery } from '@apollo/client'

import { selectProfile, setProfileData } from '../../app/store/slices/profile'
import { setAuthData } from '../../app/store/slices/auth'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import Spinner from '../../components/Spinner'
import client from '../../utils/apolloClient'

import ProfileSidebar from '../../components/ProfileSidebar'
import PageHeader from '../../components/profilepage/PageHeader'
import PageTemplate from '../../components/profilepage/PageTemplate'
import PageContent from '../../components/profilepage/PageContent'
import Image from 'next/image'
import { setCartData } from '../../app/store/slices/cart'

interface CustomerStruct {
  customer: {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    phone: string | null;
    acceptsMarketing: boolean;
    defaultAddress: {
      country: string | null;
      countryCodeV2: string | null;
    };
    addresses: [any];
  };
}

const  Profile: NextPage = (props: any) => {
  const [pageLoading, setPageLoading ] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef<HTMLInputElement|null>(null);
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const auth = useSelector(selectAuth);
  const router = useRouter();

  const [customerData, setCustomerData] = useState<CustomerStruct|null>(null);

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
      console.log("get customer result: ", result, response.ok);
      if (response.ok) {
        setCustomerData(result);
      }
    }
    getCustomer();
  },[auth.accessToken])

  // console.log(customerData?.customer?.id);
  if (customerData?.customer?.id) {
    dispatch(setProfileData({
        id: customerData?.customer?.id!,
        email: customerData?.customer.email!,
        firstName: customerData?.customer.firstName!,
        lastName: customerData?.customer.lastName!,
        countryCode: customerData?.customer.defaultAddress ? customerData?.customer.defaultAddress.countryCodeV2 : null
    }))
    dispatch(setAuthData({
      id: customerData?.customer.id!,
      accessToken: auth.accessToken,
      expiresAt: auth.expiresAt,
    }))
  }
  

  const selectImageHandler = () => {
		fileRef.current!.click();
	};
  const resetImageHandler = () => {
		setSelectedFile(null);
	};

  const addImage = (e:any) => {
    setSelectedFile(e.target.files[0]);
  }

  const onSubmitHandler = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submitted");
  }

  return (

        <div className='bg-black'>
          <Head>
              <title>TEMPLATE - Profile</title>
              <meta name="description" content="The Next Online Shop" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
          {
            pageLoading ? <div></div>
            :            
            <PageTemplate>
              <PageHeader title="Profile" subtitle="User information may be displayed publicly" />
              <PageContent>
                <form onSubmit={(e) => onSubmitHandler(e)}>
                  <div className='flex flex-col-reverse w-full
                  sm:flex-row lg:w-[600px] lg:m-auto'>
                    <div className='flex flex-col items-start justify-center w-full mt-10
                    sm:flex-1 sm:mt-0 sm:mr-10'>
                      <div className='w-full'>
                        <label htmlFor="firstName">
                          <span>FirstName</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          defaultValue={customerData?.customer.firstName!}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder=""
                        />
                      </div>
                      <div className='w-full mt-5'>
                        <label htmlFor="lastName">
                          <span>LastName</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          defaultValue={customerData?.customer.lastName!}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="ring-0 ring-blue-500">
                      <label htmlFor="userAvatar">
                        Photo
                      </label>
                      {
                        selectedFile ? 
                          <div onClick={resetImageHandler} className="flex items-center justify-center rounded-full inset w-28 h-28 bg-blue-500 m-auto text-2xl cursor-pointer">

                            <div className="w-28 h-28 relative ring-offset-2 ring-1 ring-gray-300 rounded-full">
                              <Image
                                src={URL.createObjectURL(selectedFile)}
                                alt="selected image"
                                layout="fill"
                                className="object-cover rounded-full" 
                              />
                            </div>
                          </div>
                        :
                      
                        <div onClick={selectImageHandler} className="flex items-center justify-center rounded-full inset w-28 h-28 bg-blue-500 m-auto text-2xl cursor-pointer">
                          {profile.firstName?.substring(0,1)}
                          <input 
                            ref={fileRef}
                            type="file"
                            hidden
                            onChange={addImage}
                          />
                        </div>
                      }
                    </div>
                  </div>
                  <div className='w-full mt-5  lg:w-[600px] lg:mx-auto'>
                    <label htmlFor="emailAddress">
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      defaultValue={customerData?.customer.email!}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder=""
                    />
                  </div>
                  <div className='w-full mt-5 lg:w-[600px] lg:mx-auto'>
                    <label htmlFor="phoneNumber">
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      defaultValue={customerData?.customer.phone!}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder=""
                    />
                  </div>
                  <div className='flex items-center justify-center mt-5 mb-10  lg:w-[600px] lg:mx-auto'>
                    <button className='w-full py-2  bg-sky-800 text-white rounded-xl'>
                        Submit
                    </button>
                  </div>
                  
                </form>       
              </PageContent>
            </PageTemplate>
          }
        
      </div>
    
  )
}

export default Profile
