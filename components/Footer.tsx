import React from 'react'
import Image from 'next/image'
import logoFB from "../assets/images/logo-facebook.png"
import logoInstagram from "../assets/images/logo-instagram.png"
import logoTwitter from "../assets/images/logo-twitter.png"
import logoYoutube from "../assets/images/logo-youtube.png"
import logoTwitch from "../assets/images/logo-twitch.png"
import copyright from "../assets/images/copyright.png"

function Footer() {

  const socialMedia = [
    {
      name: "Facebook",
      logoMedia: logoFB
    },
    {
      name: "Instagram",
      logoMedia: logoInstagram
    },
    {
      name: "Twitter",
      logoMedia: logoTwitter
    },
    {
      name: "Youtube",
      logoMedia: logoYoutube
    },
    {
      name: "Twitch",
      logoMedia: logoTwitch
    }
  ]

  return (
    <footer className='flex items-start justify-between h-full bg-black w-full p-2 text-white
    sm:items-stretch'>

      <div className='flex flex-col justify-between w-1/2 ring-0 ring-lime-100 
      sm:flex-1'>

        <div className='flex flex-col justify-start mt-5 sm:flex-row sm:space-x-5'>

          <div>
            <h5 className='text-slate-100 font-bold mb-4'>Company</h5>
            <ul className='text-sm text-gray-400 space-y-1'>
                <li>About Us</li>
                <li>Careers</li>
                <li>Gift Cards</li>
                <li>FAQ</li>
              </ul>
          </div>
          <div>
            <h5 className='text-slate-100 font-bold mb-4 mt-4 sm:mt-0'>Your Account</h5>
            <ul className='text-sm text-gray-400 space-y-1'>
                <li>Account</li>
                <li>Your Orders</li>
                <li>Recommendations</li>
                <li>Browsing History</li>
              </ul>
          </div>
          <div>
            <h5 className='text-slate-100 font-bold mb-4 mt-4 sm:mt-0'>Support & Services</h5>
            <ul className='text-sm text-gray-400 space-y-1'>
                <li>Return Policy & Exchanges</li>
                <li>Apply for NextShop Card</li>
                <li>Shipping</li>
                <li>Get Email Updates</li>
                <li>Contact Us</li>
              </ul>
          </div>

        </div>

        <div className='flex items-center justify-start font-bold text-xs space-x-1 mt-10'>
          <Image                     
            src={copyright}
            alt="copyright"
            width={16}
            height={16}
            className="object-contain mr-1"
          />
          <span className='font-light'>
            NextShop. 2022 All Rights Reserved
          </span>
        </div>
      </div>

      <div className='flex flex-col w-1/2 ring-0 ring-red-500 flex-1
      sm:justify-between sm:items-end sm:flex-1'>

        <div className='flex flex-col items-end justify-end mt-5 space-y-5 
        sm:flex-row sm:mt-0 sm:space-x-5'>
          {
            socialMedia.map((sLogo) =>  (
                <div key={sLogo.name}>
                  <Image                     
                    src={sLogo.logoMedia}
                    alt={sLogo.name}
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
              )
            )
          }
        </div>
        <div className='flex flex-col items-end justify-end font-bold text-xs mt-7 space-y-3
        sm:flex-row sm:space-x-5'>
          <span>Legal</span>
          <span>Privacy Policy</span>
          <span>Manage Cookies</span>
        </div>

      </div>

    </footer>
  )
}

export default Footer