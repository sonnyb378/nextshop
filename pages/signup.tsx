import { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import logo from "../assets/images/logo.png"
import SignupForm from '../components/SignupForm'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectAuth } from '../app/store/slices/auth'

const Signup: NextPage = () => {
  const [ pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth.accessToken) {
      router.push("/profile")
    } else {
      setPageLoading(false)
    }
  },[auth.accessToken, router])
  
  return (
    <div>
      <Head>
        <title>SignUp Page</title>
        <meta name="description" content="The Next Online Shop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        pageLoading ? <div></div> :
      
      <main className='flex flex-col justify-between bg-slate-200 min-h-screen'>
        <Header />
        <div className='w-[600px] grow p-20 m-auto'>
              <div className="items-container w-80 cursor-pointer m-auto mb-10 relative">
                <Image src={logo} alt="Next Shop"
                layout="fill"
                priority={true}
                className='!relative !w-full !h-[unset]'
                />
              </div> 
              <SignupForm />  
            </div>
        <Footer />
      </main>
    }
    </div>
  )
}

export default Signup


