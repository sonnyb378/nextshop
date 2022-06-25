import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { gql, useMutation } from '@apollo/client';
import Spinner from './Spinner';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { setAuthData } from '../app/store/slices/auth';
import { selectAuth } from '../app/store/slices/auth';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setProfileData } from '../app/store/slices/profile';

const LoginForm = () => {
  const [email, setEmail ] = useState("");
  const [password, setPassword ] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState({ error: false, errorMessage: "" });
  const [fromSignUp, setFromSignUp] = useState(false);
  const router = useRouter();
  const auth = useAppSelector(selectAuth); //useSelector(selectAuth);
  const [ pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch(); //useDispatch();

  useEffect(() => {
    if (auth.accessToken) {
      const { redirect } = router.query;
      if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push("/profile");      
      }
    } else {
      setPageLoading(false)
    }
  },[auth.accessToken, router])
  
  const getCustomer = async (accessToken: string, expiresAt: string) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer/${accessToken}`)
    const result = await response.json();

    if (response.ok) {
      // console.log("LoginForm customer result: ", result);
      dispatch(setProfileData({
        id: result?.customer?.id!,
        email: result?.customer.email!,
        firstName: result?.customer.firstName!,
        lastName: result?.customer.lastName!,
        countryCode: result?.customer.defaultAddress ? result?.customer.defaultAddress.countryCodeV2 : null
      }))
      dispatch(setAuthData({
        id: result?.customer.id!,
        accessToken: accessToken,
        expiresAt: expiresAt,
      }))
    }
  }

  const { t } = router.query
  useEffect(() => {
    if (t) {
      if (new Date().getTime() > new Date(Number(t)).getTime()) {
        setFromSignUp(false);
      } else {
        setFromSignUp(true);
      }
    }   
  }, [t])

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("login");
    setFromSignUp(false);
    setLoading(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/customer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          email,
          password
        }
      })
    })

    const result = await response.json();

    if (response.ok) {
      const resLogin = result?.customerAccessTokenCreate;
      if (resLogin?.customerUserErrors.length > 0) {
        setSubmitError({ error: true, errorMessage: resLogin?.customerUserErrors[0]?.message})
      } 
  
      if (resLogin?.customerAccessToken) {      
        const accessToken = resLogin.customerAccessToken?.accessToken;
        const expiresAt = resLogin.customerAccessToken?.expiresAt;
        if (!!accessToken) {
          
          getCustomer(accessToken, expiresAt)
          // dispatch(setAuthData({
          //   id: "",
          //   accessToken: accessToken,
          //   expiresAt: expiresAt
          // }))
        
        }
        setLoading(false)
      }
    }


  }

  return (
    
    <div className='w-full'>
      {
        pageLoading ? <div></div> :
        <div>
      {
        loading && <div className="flex items-center justify-center p-3">
        <Spinner primaryColor="fill-primary" secondaryColor='text-slate-300'/>
      </div>
      }
      {
        submitError?.error && <div className="text-red-500 mb-3 p-0">Error: {submitError.errorMessage}
        </div>
      }
      {
        fromSignUp && <div className="flex items-center justify-start p-5 bg-purple-300 border-1 border-gray-300 text-accentDark rounded-lg">Thank you for signing up</div>
      }
      

        <div className='p-5 rounded-xl shadow-md bg-gray-100 mt-2'>
          <form onSubmit={(e) => onSubmitHandler(e)}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-black ">Your email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400" placeholder="youremail@gmail.com" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">Your password</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required/>
            </div>
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input  onChange={(e) => setRememberMe(e.target.checked) } checked={rememberMe} id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "  />
              </div>
              <label htmlFor="remember" className="ml-2 text-sm font-sm text-black ">Remember me</label>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>

        </div>
        <div className='flex items-center justify-between text-sm mt-3'>
          <div className='text-blue-800 hover:text-purple-600'>
            <Link href="/signup">Create an Account</Link></div>
            <div className='text-blue-800 hover:text-purple-600'>
            <Link href="/forgotpassword">Forgot Password?</Link></div>
        </div>
      </div>
    }
    </div>
  )
}

export default LoginForm