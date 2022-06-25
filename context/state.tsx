import React, { useCallback, useMemo } from "react";
import { createContext, useContext, useState } from "react";

import { ICartDataStruct, ILinesEdges } from "../ts/cart/interfaces/cart";
import { IShippingInformation } from "../ts/context/interfaces/shipping_information"
import { IDeliveryMethod} from "../ts/context/interfaces/delivery_method";
import { IPaymentMethod } from "../ts/context/interfaces/payment_method";
import { Countries } from "../model/countries";

export interface CheckoutState {
  contactInformation: { email: string };
  shippingInformation: IShippingInformation;
  cart: ICartDataStruct;
  deliveryMethod: IDeliveryMethod;
  paymentMethod: IPaymentMethod;
}  

// export interface InitialState {
//   checkoutInfo: CheckoutState;
// }

const initialState = {
  
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
  cart: {
    id: null,
    estimatedCost: null,
    lines: null
    // id: "",
    // estimatedCost: {
    //   subtotalAmount: {
    //     amount: "",
    //     currencyCode: "",
    //   },
    //   totalAmount: {
    //     amount: "",
    //     currencyCode: "",
    //   },
    //   totalDutyAmount: {
    //     amount: "",
    //     currencyCode: "",
    //   },
    //   totalTaxAmount: {
    //     amount: "",
    //     currencyCode: "",
    //   },
    // },
    // lines: {
    //   edges: [
    //     {
    //       id: "",
    //       attributes: [{ key: "", value: "" }],
    //       estimatedCost: {
    //         subtotalAmount: null,
    //         totalAmount: null,
    //         totalDutyAmount: null,
    //         totalTaxAmount: null,
    //       },
    //       quantity: 0,
    //       merchandise: {
    //         id: "",
    //         title: "",
    //         quantityAvailable: 0,
    //         image: {
    //           url: "",
    //           width: 0,
    //           height: 0,
    //         },
    //         priceV2: {
    //           amount: "0.00",
    //           currencyCode: "USD",
    //         },
    //         product: {
    //           id: "",
    //           title: "",
    //           description: "",
    //         },
    //       },
    //     },
    //   ] as [ILinesEdges],
    //   pageInfo: {
    //     endCursor: "",
    //     startCursor: "",
    //     hasNextPage: false,
    //     hasPreviousPage: false,
    //   },
    // },
  },
  deliveryMethod: {
    type: "Standard",
    price: {
      amount: "",
      currencyCode: "",
    },
  },
  paymentMethod: {
    type: "Credit Card",
    info: {
      cc: "",
      nameoncc: "",
      expdate: "",
      cvc: "",
    },
  }
};

const ctxSetters = {
  setCtxContactInformation: (email: string) => {},
  setCtxShippingInformation: (input:any) => {},
  setCtxCart: (input:any) => {},
  setCtxDeliveryMethod: (input:any) =>{},
  setCtxPaymentMethod: (input:any) => {},
}

const AppContext = createContext<CheckoutState>(initialState);
const AppContextSetters = createContext(ctxSetters)

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextState, setContextState] = useState<CheckoutState>(initialState);
  
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
    // setContextState((prev) => {
    //   return {
    //     ...prev,
    //     deliveryMethod: {
    //       ...input
    //     }
    //   }
    // })
  },[])

  const setCtxPaymentMethod = useCallback((input:any) => {
    // setContextState((prev) => {
    //   return {
    //     ...prev,
    //     paymentMethod: {
    //       ...input
    //     }
    //   }
    // })
  },[])

  const ctxSetters = useMemo(() => ({ 
    setCtxCart, 
    setCtxContactInformation,
    setCtxShippingInformation,
    setCtxDeliveryMethod,
    setCtxPaymentMethod
  }), [setCtxCart, setCtxContactInformation, setCtxShippingInformation, setCtxDeliveryMethod, setCtxPaymentMethod])

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
