import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/receipts/description";
import Filters from "../components/receipts/Filters";
import Total from "../components/receipts/total";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import PageLoader from "../components/page-loader";
import {AddressReactType} from "./checkout";
import {gql, useLazyQuery} from "@apollo/client";
import {NextPage} from "next";


type GetOrdersFullType = {
    getOrders_FULL: OrderType[]
}

type OrderType = {
    datetime: string
    price_total: number
    archive: ArchiveType
    payment_method: PaymentMethodType
    reference: string
    receipt_number: number
}

type PaymentMethodType = {
    type: "CARD" | "PAYPAL"
    account: string
}

type ArchiveType = {
    billing_address: AddressReactType
}

const GET_RECEIPTS_FULL = gql`
    query GET_RECEIPTS_FULL {
        getOrders_FULL {
            datetime
            shipping_cost
            price_total
            reference
            receipt_number
            archive {
                billing_address {
                    first_address
                    second_address
                    postcode
                    city
                    country
                    notes
                }
            }
            payment_method {
                type
                account
            }
        }
    }
`

const Orders = () => {
    const {accessToken, loading, logged, functions: {handleAuthErrors}} = useAuth()
    const router = useRouter()
    const [reTry, setReTry] = useState(false)
    const [receipts, setReceipts] = useState<OrderType[]>([])

    const [GetReceiptsFull] = useLazyQuery<GetOrdersFullType>(GET_RECEIPTS_FULL, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const newReceipts: OrderType[] = []
            for(const receipt of data.getOrders_FULL) {
                newReceipts.push(receipt)
            }
            setReceipts(newReceipts)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            console.log(error.message)
        }
    })

    useEffect(() => {
        if(!loading && logged) {
            GetReceiptsFull({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [logged, loading])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            GetReceiptsFull({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [accessToken.token, reTry])

    if(loading) {
        return <PageLoader display={true}/>
    }
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="text-3xl">My Receipts</h1>
            <Filters/>
            {
                receipts.map((receipt) =>
                    <Receipt key={receipt.reference} receipt={receipt}/>
                )
            }
        </LayoutPrivate>
    );
};

type ReceiptProps = {
    receipt: OrderType
}

const Receipt: NextPage<ReceiptProps> = ({receipt}) => {
    const [orderOpen, setOrderOpen] = useState(false)

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md">
            <Description orderOpen={orderOpen}
                         setOrderOpen={setOrderOpen}
                         receipt={{
                             price_total: receipt.price_total,
                             reference: receipt.reference,
                             datetime: receipt.datetime,
                             receipt_number: receipt.receipt_number,
                             payment_method: receipt.payment_method
                         }}
            />
            {
                orderOpen ?
                    <Total
                        receipt={{
                            price_total: receipt.price_total,
                            reference: receipt.reference,
                            type: receipt.payment_method.type,
                            account: receipt.payment_method.account,
                            billing_address: receipt.archive.billing_address
                        }}
                    />
                    : null
            }
        </div>
    )
}

export default Orders;