import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import AddAddress from "../components/addresses/add-address";
import ExistingAddress from "../components/addresses/existing-address";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import PageLoader from "../components/page-loader";

type GetBillingAddressesType = {
    getUserInfo: {
        billing_addresses: BillingAddresses[]
    }
}
type BillingAddresses = {
    address_id: string
    first_address: string
    second_address: string | null
    postcode: string
    city: string
    country: string
    notes: string | null
    coordinates: string | null
}

const GET_BILLING_ADDRESSES = gql`
    query GET_BILLING_ADDRESSES {
        getUserInfo {
            billing_addresses {
                address_id
                first_address
                second_address
                postcode
                city
                country
                notes
                coordinates
            }
        }
    }
`


const BillingAddresses = () => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const router = useRouter()
    const [addresses, setAddresses] = useState<BillingAddresses[]>([])
    const [renderFetchAddresses, setRenderFetchAddresses] = useState(false)
    const [reTry, setReTry] = useState(true)

    const [getBillingAddresses] = useLazyQuery(GET_BILLING_ADDRESSES, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data: GetBillingAddressesType) => {
            const dataFormatted: BillingAddresses[] = []
            data.getUserInfo.billing_addresses.forEach((element) => dataFormatted.push(element))
            setAddresses(dataFormatted)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            setReTry(false)
            console.log(error.message)
        }
    })

    useEffect(() => {
        if(accessToken.token !== null && (reTry || renderFetchAddresses)) {
            getBillingAddresses({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
            setRenderFetchAddresses(false)
            setReTry(false)
        }
    }, [accessToken, renderFetchAddresses])


    if(loading) return <PageLoader display/>
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-16 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="p-4 text-3xl">My Billing Addresses</h1>
            <AddAddress billing={true} setRenderFetchAddresses={setRenderFetchAddresses}/>
            {
                addresses.length === 0 ?
                    <div className="w-full flex items-center p-14 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>
                    :
                    addresses.map((element) =>
                        <ExistingAddress
                            key={element.address_id}
                            billing={true}
                            currentAddress={element}
                            setRenderFetchAddresses={setRenderFetchAddresses}
                        />
                    )
            }
        </LayoutPrivate>
    );
};

export default BillingAddresses;