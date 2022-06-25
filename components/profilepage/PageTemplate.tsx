import React, { useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import ProfileSidebar from '../ProfileSidebar'

import Modal from "../../components/Modal"

import { IAddressStruct } from '../../ts/profile/addresses/address'

// export interface AddressStruct {
//   isOpen: boolean
//   addressId: string|null
//   address: string|null
// }

const PageTemplate:React.FC<{objAddress?:IAddressStruct, setOpenHandler?:any, deleteAddressHandler?:any, children:any}> = ({objAddress, setOpenHandler, deleteAddressHandler, children}) => {

  // console.log("PageTemplate: ", objAddress?.isOpen, objAddress?.address)
  const defaultValues = {
    isOpen: false,
    addressId: null,
    address: null
  }

  return (
    <main className='flex flex-col items-center justify-between min-h-screen'>
      <Modal objAddress={objAddress|| defaultValues } setOpenHandler={setOpenHandler} deleteAddressHandler={deleteAddressHandler}/>
              <Header />
              <div className="grow flex flex-col items-center justify-center w-full h-full
              ">
                
                <div className='grow flex flex-col justify-start w-full h-full 
                sm:flex-row sm:justify-center sm:items-stretch
                '>

                  <div className='bg-accentDark p-2 w-full ring-0 ring-red-500
                  sm:flex sm:min-w-[220px] sm:max-w-[220px] sm:grow sm:justify-start sm:items-start'>
                    <ProfileSidebar />
                  </div>
                  <div className='p-2 ring-0 ring-red-500 grow flex flex-col items-start justify-start bg-white
                  sm:w-full sm:grow'>
                    {children}
                  </div>

                </div>
              
              </div>              
              <Footer />
            </main>
  )
}

export default PageTemplate