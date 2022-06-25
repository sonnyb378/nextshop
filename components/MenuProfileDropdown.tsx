import { Menu, Transition } from '@headlessui/react'
import { Fragment, MouseEventHandler } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { PencilIcon, LogoutIcon, CogIcon, UserIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'

import { setAuthData } from '../app/store/slices/auth'
import { setProfileData } from '../app/store/slices/profile'
// import { setBroswingHistoryData } from '../app/store/slices/browsinghistory'
import { useRouter } from 'next/router'

const MenuProfileDropdown: React.FC<{avatar?:string}> = ({avatar}) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onLogoutHandler = () => {
    // console.log("logout");
    dispatch(setAuthData({
      id: null,
      accessToken: null,
      expiresAt: null
    }))
    dispatch(setProfileData({
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      countryCode: null
    }))
    // dispatch(setBroswingHistoryData(
    //   {
    //     id: null,
    //     title: null,
    //     description: null,
    //     image: {
    //       id: null,
    //       url: null,
    //       width: 0,
    //       height: 0
    //     }
    //   }
    // ))
    router.push("/auth/signin")
  }

  const profileHandler = () => {
    router.push("/profile")
  }

  return (
    <div className="">
      <Menu as="div" className="relative">
        <div className='relative'>
          <Menu.Button className="flex items-center justify-center w-9 h-9 p-1 rounded-full font-bold bg-blue-500 cursor-pointer text-accentDark  hover:text-white">
            {avatar}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute shadow-md right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
            <Menu.Item>
                {({ active }:any) => (
                  <button          
                    onClick={profileHandler}          
                    className={`${
                      active ? 'bg-primary text-white' : 'text-primary'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <UserIcon
                      className={`mr-2 h-5 w-5 ${active ? 'text-white' : "text-primary"}` }
                    />
                    Profile
                  </button>
                )}
              </Menu.Item>
            </div>
            {/* <div className="px-1 py-1 ">              
              <Menu.Item>
                {({ active }:any) => (
                  <button                    
                    className={`${
                      active ? 'bg-primary text-white' : 'text-primary'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <CogIcon
                      className={`mr-2 h-5 w-5 ${active ? 'text-white' : "text-primary"}` }
                    />
                    Account Settings
                  </button>
                )}
              </Menu.Item>
              
            </div> */}

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }:any) => (
                  <button
                    onClick={onLogoutHandler}
                    className={`${
                      active ? 'bg-primary text-white' : 'text-primary'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <LogoutIcon
                      className={`mr-2 h-5 w-5 ${active ? 'text-white' : "text-primary"}` }                       
                    />
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuProfileDropdown;
