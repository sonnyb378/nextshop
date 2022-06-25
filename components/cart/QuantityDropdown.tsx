import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import React, { Fragment, useEffect, useState } from 'react'

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

const QuantityDropdown:React.FC<{limit:number, currentQty?:number, onQtyChangeHandler
  ?:any}> = ({limit, currentQty, onQtyChangeHandler}) => {
  
  const [countLimit, setCountLimit] = useState(10)

  useEffect(() => {
    setCountLimit(limit);
    // console.log("qtyArray: ", countLimit);
  },[limit, countLimit])
  
  const qtyArray = Array.from(Array(countLimit).keys()).map((i) => ++i )
  // console.log("countLimit: ", qtyArray);

  return (
    <div>
      <Listbox value={currentQty} onChange={(e:any) => onQtyChangeHandler(e)}>
        {({ open }) => (
        <>
          <Listbox.Label className="block"></Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <span className="ml-3 block truncate">{currentQty}</span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {
                  qtyArray.map((qty) => (
                    <Listbox.Option
                      key={qty}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={qty}
                    >
                    {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {qty}
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                }
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
    </div>
  )
}

export default QuantityDropdown