import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import logo from "../assets/images/logo.png"

import { SearchIcon, ShoppingCartIcon } from "@heroicons/react/outline"
import Link from 'next/link'

import { selectProfile, setProfileData } from '../app/store/slices/profile'
import { selectAuth, setAuthData } from '../app/store/slices/auth'
import { selectCart } from '../app/store/slices/cart'
import { useSelector, useDispatch } from 'react-redux'

import MenuProfileDropdown from './MenuProfileDropdown'
import SideCart from './cart/SideCart'
import { useRouter } from 'next/router'

function Header() {
  const profile = useSelector(selectProfile);
  const auth = useSelector(selectAuth);
  const cart = useSelector(selectCart);
  const router = useRouter();

  const [openCart, setOpenCart] = useState(false);

  // const shoppingCartHandler = () => {
  //   console.log("open shopping cart")
  //   setOpenCart(true)
  // }
  const shoppingCartHandler = () => {
    router.push(`/cart`)
  }

  return (
    <header className='flex items-center justify-between  w-full bg-primary h-20 z-20'>
      <SideCart cartOpen={openCart} setCartOpen={setOpenCart} />
      <div className='flex-1 ml-5'>
        <Link href="/">
          <div className="items-container w-40 cursor-pointer relative">
            <Image src={logo} alt="Next Shop"
            layout="fill"
            priority={true}
            className='!relative !w-full !h-[unset]'
            />
          </div>        
        </Link>
      </div>
      <div className="flex items-center flex-grow justify-end space-x-3 mr-5">
        <div className='flex items-center relative'>
          <SearchIcon  className='absolute w-7 text-gray-300 m-1 p-1'/>
          <input type="text" placeholder="Search..." className="bg-accentDark 
          group
          p-1
          h-9
          rounded-lg
          border-none
          text-sm    
          indent-8  
          placeholder:text-sm 
          placeholder:text-gray-500
          text-slate-300
          border-1 border-slate-700
          focus:border-transparent
          focus:ring-1
          focus:ring-purple-800"  />
        </div>
        <div onClick={shoppingCartHandler}  className="flex items-center justify-center relative cursor-pointer">
          <ShoppingCartIcon className='w-7 text-slate-100'/>
          <div className='absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-accentDark/90 text-slate-200 text-xs'>{ cart?.itemsCount}</div>
        </div>
        <div className=''>            
            {
              auth?.accessToken ? 
              <MenuProfileDropdown 
                avatar={profile.firstName?.substring(0,1)}
              />
            :
              <button className="text-white text-sm p-2 px-5 bg-blue-500 rounded-lg hover:bg-blue-600">
                  <Link href="/auth/signin">
                    Sign In
                  </Link>
              </button>
            }
        </div>
      </div>

    </header>
  )
}

export default Header