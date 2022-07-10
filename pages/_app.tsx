import '../styles/globals.css'
import "../styles/images.css"
import "../styles/animations.css"
import "../styles/swiper.css"
import "../styles/phone.css"

import type { AppProps } from 'next/app'
import Layout from "../components/layout";
import {ResizerContext} from "../contexts/resizer-context";
import {LayoutContext} from "../contexts/layout-context";
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {AuthContext} from "../contexts/auth-context";
import {ToastContainer} from "react-toastify";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql"
})
const authLink = setContext((_, {headers, }) => {
    return {
        credentials: "include",
        headers: {
            ...headers
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ApolloProvider client={client}>
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
              <ResizerContext>
                  <LayoutContext>
                      <Layout>

                            <Component {...pageProps} />
                      </Layout>
                  </LayoutContext>
              </ResizerContext>
          </AuthContext>
      </ApolloProvider>
  )
}

export default MyApp
