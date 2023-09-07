import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import * as Icon from 'react-feather';


interface PropsModal {
  open: boolean,
  setOpen: (value: boolean) => void,
  title?: string,
  buttons?: React.ReactNode
  content?: React.ReactNode[]
  className?: string,
  maxHeight?: string,
}

export default function ModalCust({open, setOpen, buttons, title, content, className, maxHeight}: PropsModal) {

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative  " style={
        {
          zIndex: 10000
        }
      } initialFocus={cancelButtonRef} onClose={setOpen}>

        <div className="fixed inset-0 z-10  overflow-y-auto">
          <div className="grid justify-center h-screen" >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={` relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all   w-screen h-50vh  lg:my-8 lg:max-h-60vh sm:max-w-5xl  ${className} ${maxHeight}`}>
                {
                  title && ( 
                    <div className='flex flex-row justify-between pl-4 pt-6 pr-7 mb-6 mt-3 '>
                      <span className="ml-2 lg:text-2xl   text-gray-900 text-center lg:text-left md:text-left font-medium">{title}</span>
                      <div className='flex justify-end cursor-pointer' onClick={() => setOpen(false)} ><Icon.X /></div>
                    </div>
                  )
                }
                <>

                  {content}
                </>
                {
                  buttons && (
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">  

                      {buttons}
                    </div>
                  )
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
