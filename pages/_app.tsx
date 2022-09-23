import '../styles/globals.css'
import "../styles/images.css"
import "../styles/animations.css"
import "../styles/swiper.css"
import "../styles/phone.css"
import "../styles/payments.css"


import type {AppProps} from 'next/app'
import Layout from "../components/layout";
import {ResizerContext} from "../contexts/resizer-context";
import {LayoutContext} from "../contexts/layout-context";
import {ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {AuthContext} from "../contexts/auth-context";
import {ToastContainer} from "react-toastify";
import {CartContext} from "../contexts/cart-context";
import {onError} from "@apollo/client/link/error";
import {HolidayContext} from "../contexts/holiday-context";
import {API_HOST} from "../settings";
import React from "react";

const errorLink = onError(({networkError}) => {
    if (networkError) console.log(`[Network error]: ${networkError.message}`);
});
const httpLink = createHttpLink({
    uri: `${API_HOST}/graphql`
})
const authLink = setContext((_, {headers}) => {
    return {
        credentials: "include",
        headers: {
            ...headers
        }
    }
})

export const apolloClient = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache()
})

function MyApp({Component, pageProps, ...appProps}: AppProps) {

    const isLayoutNeeded = ![`/work-in-progress`].includes(appProps.router.pathname);
    const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

    return (
        <ApolloProvider client={apolloClient}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <AuthContext>
                <CartContext>
                    <HolidayContext>
                        <ResizerContext>
                            <LayoutContext>
                                <LayoutComponent>
                                    <Component {...pageProps} />
                                </LayoutComponent>
                            </LayoutContext>
                        </ResizerContext>
                    </HolidayContext>
                </CartContext>
            </AuthContext>
        </ApolloProvider>
    )
}

export default MyApp
