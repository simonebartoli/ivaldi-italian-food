import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import AddAddress from "../components/addresses/add-address";
import ExistingAddress from "../components/addresses/existing-address";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";

type GetShippingAddressesType = {
    getUserInfo: {
        shipping_addresses: ShippingAddresses[]
    }
}
type ShippingAddresses = {
    address_id: string
    first_address: string
    second_address: string | null
    postcode: string
    city: string
    notes: string | null
    coordinates: string | null
}

const GET_SHIPPING_ADDRESSES = gql`
    query GET_SHIPPING_ADDRESSES {
        getUserInfo {
            shipping_addresses {
                address_id
                first_address
                second_address
                postcode
                city
                notes
                coordinates
            }
        }
    }
`

const MetaShippingAddress = () => {
    return (
        <Head>
            <title>{`Shipping Addresses - Ivaldi Italian Food`}</title>
            <meta name="description" content={"Check, modify and add shipping addresses in this page."}/>
            <meta name="keywords" content={"addresses,billing,edit,add,remove,check,expedition,shipping"}/>
            <meta name="robots" content="index, follow"/>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="language" content="English"/>
            <meta name="revisit-after" content="5 days"/>
            <meta name="author" content="Ivaldi Italian Food"/>

            <meta property="og:title" content={`Shipping Addresses - Ivaldi Italian Food`}/>
            <meta property="og:site_name" content={HOST}/>
            <meta property="og:url" content={`${HOST}/shipping-addresses`}/>
            <meta property="og:description" content={"Check, modify and add shipping addresses in this page."}/>
            <meta property="og:type" content="product"/>

            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content={TWITTER_USERNAME}/>
            <meta name="twitter:title" content={`${HOST}/shipping-addresses`}/>
            <meta name="twitter:description" content={"Check, modify and add shipping addresses in this page."}/>
        </Head>
    )
}

const ShippingAddresses = () => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const router = useRouter()
    const [addresses, setAddresses] = useState<ShippingAddresses[]>([])
    const [renderFetchAddresses, setRenderFetchAddresses] = useState(false)
    const [reTry, setReTry] = useState(true)

    const [getShippingAddresses] = useLazyQuery(GET_SHIPPING_ADDRESSES, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data: GetShippingAddressesType) => {
            const dataFormatted: ShippingAddresses[] = []
            data.getUserInfo.shipping_addresses.forEach((element) => dataFormatted.push(element))
            setAddresses(dataFormatted)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }

            setReTry(false)
            console.log(error.graphQLErrors)
        }
    })


    useEffect(() => {
        if(accessToken.token !== null && (reTry || renderFetchAddresses)) {
            getShippingAddresses({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })

            setRenderFetchAddresses(false)
            setReTry(false)
        }
    }, [accessToken, renderFetchAddresses, reTry])

    if(loading) return (
        <>
            <MetaShippingAddress/>
            <PageLoader display/>
        </>
    )
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-16 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <MetaShippingAddress/>
            <h1 className="p-4 text-3xl">My Shipping Addresses</h1>
            <AddAddress billing={false} setRenderFetchAddresses={setRenderFetchAddresses}/>
            {
                addresses.length === 0 ?
                    <div className="w-full flex items-center p-14 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>
                    :
                    addresses.map((element) =>
                        <ExistingAddress
                            key={element.address_id}
                            billing={false}
                            currentAddress={{
                                ...element,
                                country: "United Kingdom"
                            }}
                            setRenderFetchAddresses={setRenderFetchAddresses}
                        />
                    )
            }
        </LayoutPrivate>
    );
};


export default ShippingAddresses;