import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

import { gql, useMutation } from '@apollo/client';
import Spinner from './Spinner';


interface CustomerCreate {
  customerCreate: {
    customer: any;
    customerUserErrors: any;
  }
}
const SignupForm = () => {
  const router = useRouter();
  const [ cFirstName, setCfirstName] = useState("");
  const [ cLastName, setClastName] = useState("");
  const [ cEmail, setCEmail] = useState("");
  const [ isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordRepeatInputRef = useRef<HTMLInputElement>(null);

  const [submitError, setSubmitError] = useState({ error: false, errorMessage: "" });

  const [dataNewCustomer, setDataNewCustomer] = useState<CustomerCreate>();

  // const [addCustomer, { data: dataNewCustomer, loading }] = useMutation(REGISTER_CUSTOMER);

  

  useEffect(() => {
    const resCustomerCreate = dataNewCustomer?.customerCreate;
    if (resCustomerCreate?.customerUserErrors.length > 0) {
      setSubmitError({ error: true, errorMessage: resCustomerCreate?.customerUserErrors[0]?.message})
    } 
  },[dataNewCustomer?.customerCreate])

  useEffect(() => {
    // console.log("useEffect: ", submitError, dataNewCustomer);
    if (!submitError.error && dataNewCustomer?.customerCreate?.customer?.id) {
      const newDate = new Date().setSeconds(new Date().getSeconds() + 5);
      router.push(`/auth/signin?t=${new Date(newDate).getTime()}`)
    }
  },[dataNewCustomer?.customerCreate?.customer?.id, router, submitError, dataNewCustomer])


  const onSubmitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setSubmitError({ error: false, errorMessage: ""})

    const pwd1 = passwordInputRef.current?.value;
    const pwd2 = passwordRepeatInputRef.current?.value;

    if (pwd1 !== pwd2) {
      setSubmitError(
        { 
          error: true, 
          errorMessage: "Please confirm your password"
        }
      )
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"        
      },
      body: JSON.stringify({
        firstName: cFirstName,
        lastName: cLastName,
        email: cEmail,
        password: pwd1,
        acceptsMarketing: isChecked
      })
    })
    
    const result = await response.json();
    console.log("customerCreate: ", result);

    if (response.ok) {
      setLoading(false);
      if (result.customerCreate.customer) {
        setDataNewCustomer(result)
      } else {
        if (result.customerCreate.customerUserErrors) {
          setSubmitError({ 
            error: true, 
            errorMessage: result.customerCreate.customerUserErrors.message })
        } else {
          setSubmitError({ error: true, errorMessage: result.customerCreate.customerUserErrors.message })
        }
      }
    }

    

    // addCustomer({
    //   variables: {
        // input: {
        //   firstName: cFirstName, //firstNameInputRef.current?.value,
        //   lastName: cLastName, //lastNameInputRef.current?.value,
        //   email: cEmail, //emailInputRef.current?.value,
        //   password: pwd1,
        //   acceptsMarketing: isChecked
        // }
    //   }
    // })

  }

  return (
    <div className='w-full'>
      {
        loading && <div className="flex items-center justify-center p-3">
        <Spinner primaryColor="fill-primary" secondaryColor='text-slate-300'/>
      </div>
      }
      {
        submitError?.error && <div className="text-red-500 mb-3 p-0">Error: {submitError.errorMessage}
        </div>
      }
      <div className='p-5 rounded-xl shadow-md bg-gray-100 mt-2 mb-1'>        
        <form onSubmit={onSubmitHandler}>
          <div className="mb-6">
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-black ">Firstname</label>
            <input onChange={(e)=> setCfirstName(e.target.value)} value={cFirstName} type="text" id="firstName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder=""  required/>
          </div>
          <div className="mb-6">
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-black ">Lastname</label>
            <input onChange={(e)=> setClastName(e.target.value)} value={cLastName} type="text" id="lastName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="" required/>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black ">Your email</label>
            <input onChange={(e)=> setCEmail(e.target.value)} value={cEmail} type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="youremail@gmail.com" required/>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Your password</label>
            <input ref={passwordInputRef} type="password" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
          </div>
          <div className="mb-6">
            <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-black">Repeat password</label>
            <input ref={passwordRepeatInputRef} type="password" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required/>
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input onChange={(e) => setIsChecked(e.target.checked) } checked={isChecked}  id="marketing" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " />
            </div>
            <label htmlFor="marketing" className="ml-2 text-sm font-sm text-black">Do you want to receive marketing emails?</label>
          </div>
          <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign Up</button>
        </form>
      </div>
      <div className='flex items-center justify-between text-sm mt-3'>
        <div className='text-blue-800 hover:text-purple-600'>
          <Link href="/auth/signin">I already have an account</Link></div>
          <div className='text-blue-800 hover:text-purple-600'>
          <Link href="/forgotpassword">Forgot Password?</Link></div>
      </div>
    </div>
  )
}

export default SignupForm


