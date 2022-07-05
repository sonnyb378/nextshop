import React, { useCallback, useMemo } from "react";
import { createContext, useContext, useState } from "react";

import { ICartDataStruct, ILinesEdges } from "../ts/cart/interfaces/cart";
import { IShippingInformation } from "../ts/context/interfaces/shipping_information"
import { IDeliveryMethod} from "../ts/context/interfaces/delivery_method";
import { IPaymentMethod } from "../ts/context/interfaces/payment_method";
import { ICheckout } from "../ts/cart/interfaces/cart";
import { Countries } from "../model/countries";

export interface CheckoutState {
  checkout: ICheckout | null;
  cart: ICartDataStruct;
  contactInformation: { email: string };
  shippingInformation: IShippingInformation;
  deliveryMethod: IDeliveryMethod;
  paymentMethod: IPaymentMethod;
}  

// export interface InitialState {
//   checkoutInfo: CheckoutState;
// }

const initialState = {
  checkout: null,
  cart: {
    id: null,
    estimatedCost: null,
    lines: null
  },
  contactInformation: {
    email: "",
  },
  shippingInformation: {
    firstname: "",
    lastname: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: Countries[231],
    phone: "",
  }, 
  deliveryMethod: {
    handle: "",
    title: "",
    priceV2: {
      amount: "",
      currencyCode: "",
    },
  },
  paymentMethod: {
    type: "cc",
    info: {
      cc: "",
      nameoncc: "",
      expdate: "",
      cvv: "",
    },
  }
};

const ctxSetters = {
  setCtxCheckout: (input:any) => {},
  setCtxCart: (input:any) => {},
  setCtxContactInformation: (email: string) => {},
  setCtxShippingInformation: (input:any) => {},
  setCtxDeliveryMethod: (input:any) =>{},
  setCtxPaymentMethod: (input:any) => {},
}

const AppContext = createContext<CheckoutState>(initialState);
const AppContextSetters = createContext(ctxSetters)

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextState, setContextState] = useState<CheckoutState>(initialState);
  
  const setCtxCheckout = useCallback((input:ICheckout) => {
    // console.log("setCtxCart");
    setContextState((prev) => {
        return {
            ...prev,
            checkout: { ...input }
            }
    })
  },[])

  const setCtxCart = useCallback((input:ICartDataStruct) => {
    // console.log("setCtxCart");
    setContextState((prev) => {
        return {
            ...prev,
            cart: { ...input }
            }
    })
  },[])
  
  const setCtxContactInformation = useCallback((email: string) => {
    setContextState((prev) => {
      return {
        ...prev,
        contactInformation: {
          email: email
        }
      }
    })
  },[])

  const setCtxShippingInformation = useCallback((input:any) => {
    // console.log("input: ", {...input})
    setContextState((prev) => {      
      return {
        ...prev,
        shippingInformation: {
          ...input
        }
      }
    })
  },[]);



  const setCtxDeliveryMethod = useCallback((input:any) => {
    setContextState((prev) => {
      return {
        ...prev,
        deliveryMethod: {
          ...input
        }
      }
    })
  },[])

  const setCtxPaymentMethod = useCallback((input:any) => {
    setContextState((prev) => {
      return {
        ...prev,
        paymentMethod: {
          ...input
        }
      }
    })
  },[])

  const ctxSetters = useMemo(() => ({ 
    setCtxCheckout,
    setCtxCart, 
    setCtxContactInformation,
    setCtxShippingInformation,
    setCtxDeliveryMethod,
    setCtxPaymentMethod
  }), [setCtxCheckout, setCtxCart, setCtxContactInformation, setCtxShippingInformation, setCtxDeliveryMethod, setCtxPaymentMethod])

  return <AppContext.Provider value={ contextState  }>
    <AppContextSetters.Provider value={ ctxSetters }>
      {children}
    </AppContextSetters.Provider>
    </AppContext.Provider>;
};

export function useAppContext() {
  return useContext(AppContext);
}
export function useAppContextSetters() {
  return useContext(AppContextSetters);
}
