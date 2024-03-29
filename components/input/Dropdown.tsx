import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
import React, { Fragment } from 'react'

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

const Dropdown:React.FC<{title:string; value:string, options:[any],onChangeHandler:any}> = ({title,value,options,onChangeHandler}) => {
  return (
    <div className='w-full'>
      <Listbox value={value} onChange={onChangeHandler}>
        {({ open }) => (
        <>
          <Listbox.Label className="block">{title}</Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-0 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-700 focus:border-transparent sm:text-sm">
            <span className="ml-3 block line-clamp-1 ">{value}</span>
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
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 
              overflow-auto focus:outline-none sm:text-sm">
                {
                  
                options.map((option) => {
                  // console.log(typeof option)
                  return (
                    <Listbox.Option
                      key={option.name}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={option}
                    >
                    {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {
                              option.description
                            }
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
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
        </Listbox>
    </div>
  )
}

export default Dropdown