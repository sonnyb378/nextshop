import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { UserIcon, CogIcon, CreditCardIcon, HomeIcon, KeyIcon, TagIcon } from '@heroicons/react/outline'

const ProfileSidebar: React.FC = () => {
  const router = useRouter();

  // console.log("router: ", router.pathname);

  const links = [
    {
      Icon: UserIcon,
      name: "Profile",
      url: "/profile"
    },
    {
      Icon: KeyIcon,
      name: "Password",
      url: "/profile/password"
    },
    {
      Icon: HomeIcon,
      name: "Address",
      url: "/profile/address"
    },
    {
      Icon: TagIcon,
      name: "Orders",
      url: "/profile/orders"
    },
    {
      Icon: CreditCardIcon,
      name: "Payment Method",
      url: "/profile/payment_method"
    },
    {
      Icon: CogIcon,
      name: "Settings",
      url: "/profile/settings"
    }
  ]

  return (
    <div className="flex items-start justify-center w-full h-full ring-0 ring-white p-2 space-x-2
    sm:flex-col sm:space-x-0 sm:justify-start">      
        {
          links.map((link, k) => {
            const { Icon } = link;
            // console.log(router.pathname, link.url)
            return (
              <Link key={k} href={link.url}>
                <div className={`flex flex-col items-center justify-center cursor-pointer text-slate-300 mb-2 ring-0 ring-primary rounded-lg py-2 px-2 
                sm:w-full sm:flex-row sm:justify-start
                ${
                  router.pathname === link.url ? `bg-[#5d0982]`
                  :
                  link.url === "/profile/address" && router.pathname === "/profile/address/create" ? `bg-[#5d0982]`
                  :
                  `bg-secondary` 
                } 
                hover:bg-primary
                `}>
                  <Icon className="w-8 h-8 sm:w-5 sm:h-5 sm:mr-2"/>
                  <div className="text-sm hidden sm:block">{link.name}</div>
                </div>
              </Link>
            )
          })
        }
      
    </div>
  )
}

export default ProfileSidebar