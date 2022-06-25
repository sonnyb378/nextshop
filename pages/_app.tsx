import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper, makeStore } from '../app/store'

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../app/store/index";

import { ApolloProvider } from "@apollo/client";
import client from "../utils/apolloClient";

import { AppWrapper } from "../context/state";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AppWrapper>
            <Provider store={makeStore}>
                <PersistGate persistor={persistor} loading={null}>
                    <ApolloProvider client={client}>
                        <Component {...pageProps} />
                    </ApolloProvider>
                </PersistGate>
            </Provider>
        </AppWrapper>
    )
}

export default wrapper.withRedux(MyApp);
