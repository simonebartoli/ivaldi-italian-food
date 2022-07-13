import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import AddAddress from "../components/addresses/add-address";
import ExistingAddress from "../components/addresses/existing-address";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";

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
            }
        }
    }
`

const ShippingAddresses = () => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const router = useRouter()
    const [addresses, setAddresses] = useState<ShippingAddresses[]>([])

    const [getShippingAddresses] = useLazyQuery(GET_SHIPPING_ADDRESSES, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: (data: GetShippingAddressesType) => {
            const dataFormatted: ShippingAddresses[] = []
            data.getUserInfo.shipping_addresses.forEach((element) => dataFormatted.push(element))
            setAddresses(dataFormatted)
        },
        onError: (error) => {
            handleAuthErrors(error)
            console.log(error.graphQLErrors)
        }
    })

    useEffect(() => {
        if(accessToken.token !== null) getShippingAddresses()
    }, [accessToken])

    if(loading) return <PageLoader display/>
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-16 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="p-4 text-3xl">My Shipping Addresses</h1>
            <AddAddress/>
            {
                addresses.length === 0 ?
                    <div className="w-full flex items-center p-14 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>
                    :
                    addresses.map((_, index) =>
                        <ExistingAddress
                            key={index}
                            address={{
                                ..._,
                                country: "United Kingdom"
                            }}
                        />
                    )
            }
        </LayoutPrivate>
    );
};


export default ShippingAddresses;