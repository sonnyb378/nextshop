import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../../app/store/slices/auth'
import { selectProfile } from '../../app/store/slices/profile'

import { Countries } from '../../model/countries'
import { useRouter } from 'next/router'

import Spinner from '../Spinner';

import Dropdown from '../input/Dropdown'

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

const AddAddressForm:React.FC = () => {
  const router = useRouter();
  const profile = useSelector(selectProfile)
  const auth = useSelector(selectAuth)
  const [selectedCountry, setSelectedCountry] = useState(Countries[231])

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const onSubmitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageLoading(true)
    // console.log("address form submitted");
    const newAddress = {
      "address1": address1,
      "address2": address2,
      "city": city,
      "company": company,
      "country": selectedCountry.description,
      "firstName": firstName,
      "lastName": lastName,
      "phone": phone,
      "province": state,
      "zip": zip
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/address`, {
      method: "POST",
      body: JSON.stringify({
        address: newAddress,
        accessToken: auth.accessToken
      }),
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    })

    const { address, customerUserErrors} = await response.json();
    if (response.ok && address) {
      setPageLoading(false)
      router.push("/profile/address");
    } else {
      setPageLoading(false)
      setError(customerUserErrors[0]?.message)
    }


  }

  // console.log("setSelected: ", selected);
  return (
    <div className="flex flex-col items-start justify-center w-full
    lg:w-[600px] lg:m-auto">
      {
        pageLoading ? 
        <div className="flex items-center justify-center p-3 w-full">
          <Spinner primaryColor="fill-primary" secondaryColor='text-slate-300'/>
        </div>
        : ""
      }
      

      <form onSubmit={onSubmitHandler} className="w-full">
        {
          error ? <div className="text-red-500 mb-3">{error}</div> : ""

        }
        <div className="flex flex-col md:flex-row md:space-x-2">
          <div className="flex flex-col items-start justify-center w-full mb-3
          ">
            <label htmlFor="firstName">Firstname</label>
            <input onChange={(e)=>setFirstName(e.target.value)} value={firstName} type="text" name="firstName" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
            focus:outline-none focus:ring-1 focus:ring-accentDark
            "/>
          </div>
          <div className="flex flex-col items-start justify-center w-full mb-3
          ">
            <label htmlFor="lastName">Lastname</label>
            <input onChange={(e)=>setLastName(e.target.value)} value={lastName} type="text" name="lastName" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
            focus:outline-none focus:ring-1 focus:ring-accentDark
            "/>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full mb-3
        ">
          <label htmlFor="company">Company</label>
          <input onChange={(e)=>setCompany(e.target.value)} value={company} type="text" name="company" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
          focus:outline-none focus:ring-1 focus:ring-accentDark
          "/>
        </div>

        <div className="flex flex-col items-start justify-center w-full mb-3
        ">
          <label htmlFor="address1">Address</label>
          <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" name="address1" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
          focus:outline-none focus:ring-1 focus:ring-accentDark
          "/>
        </div>
        <div className="flex flex-col items-start justify-center w-full  mb-3
        ">
          <label htmlFor="address2">Apartment, suite, etc.</label>
          <input onChange={(e)=>setAddress2(e.target.value)} value={address2}  type="text" name="address2" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
          focus:outline-none focus:ring-1 focus:ring-accentDark
          "/>
        </div>
        <div className="flex items-start justify-between w-full  mb-3 space-x-3
        ">
          <div className="flex flex-col items-start justify-center w-full
          ">
            <label htmlFor="city">City</label>
            <input onChange={(e)=>setCity(e.target.value)} value={city}  type="text" name="city" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
            focus:outline-none focus:ring-1 focus:ring-accentDark
            "/>
          </div>
          <div className="flex flex-col items-start justify-center w-full
          ">
            <label htmlFor="postal">Postal</label>
            <input onChange={(e)=>setZip(e.target.value)} value={zip} type="text" name="postal" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
            focus:outline-none focus:ring-1 focus:ring-accentDark
            "/>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center w-full  mb-3
        ">
          <label htmlFor="state">State / Province</label>
          <input onChange={(e)=>setState(e.target.value)} value={state}  type="text" name="state" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
          focus:outline-none focus:ring-1 focus:ring-accentDark
          "/>
        </div>

        <Dropdown 
          title="Country"
          value={selectedCountry.description} 
          options={Countries as any}
          onChangeHandler={setSelectedCountry}
        />
      
          <div className="flex flex-col items-start justify-center w-full mt-5
          ">
            <label htmlFor="phone">Phone</label>
            <input onChange={(e)=>setPhone(e.target.value)} value={phone}  type="text" name="phone" placeholder="" className="ring-1 ring-gray-300 rounded-lg border-transparent w-full focus:border-transparent
            focus:outline-none focus:ring-1 focus:ring-accentDark
            "/>
          </div>


        <div className='flex items-center justify-center mt-5 mb-10  
        '>
          <button className='w-full py-2  bg-sky-800 text-white rounded-xl'>
              Submit
          </button>
        </div>
      </form>
    

    </div>
  )
}

export default AddAddressForm
