import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/receipts/description";
import OrdersReceiptsFilters from "../components/library/orders-receipts-filters";
import Total from "../components/receipts/total";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import PageLoader from "../components/page-loader";
import {AddressReactType} from "./checkout";
import {gql, useLazyQuery} from "@apollo/client";
import {NextPage} from "next";
import {DateTime} from "luxon";
import {validate as uuidValidate} from "uuid";
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";
import "react-toastify/dist/ReactToastify.css"

type GetReceiptsFullVarType = {
    filters: {
        priceMin?: number
        priceMax?: number,
        dateMin?: Date,
        dateMax?: Date,
        order_ref?: string
    }
}
type GetReceiptsFullType = {
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
    query GET_RECEIPTS_FULL($filters: OrderReceiptFilters!) {
        getOrders_FULL(filters: $filters) {
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

const MetaReceipts = () => {
    return (
        <Head>
            <title>{`Receipts - Ivaldi Italian Food`}</title>
            <meta name="description" content={"Access all the details of your receipts and payments here."}/>
            <meta name="keywords" content={"login,private,dashboard,orders,receipts,email,password,security,details,prices,vat,billing"}/>
            <meta name="robots" content="index, follow"/>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="language" content="English"/>
            <meta name="revisit-after" content="5 days"/>
            <meta name="author" content="Ivaldi Italian Food"/>

            <meta property="og:title" content={`Receipts - Ivaldi Italian Food`}/>
            <meta property="og:site_name" content={HOST}/>
            <meta property="og:url" content={`${HOST}/receipts`}/>
            <meta property="og:description" content={"Access all the details of your receipts and payments here."}/>
            <meta property="og:type" content="product"/>

            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content={TWITTER_USERNAME}/>
            <meta name="twitter:title" content={`${HOST}/receipts`}/>
            <meta name="twitter:description" content={"Access all the details of your receipts and payments here."}/>
        </Head>
    )
}

const Receipts = () => {
    const {accessToken, loading, logged, functions: {handleAuthErrors}} = useAuth()
    const router = useRouter()
    const [reTry, setReTry] = useState(false)
    const [receipts, setReceipts] = useState<OrderType[]>([])

    const [priceMin, setPriceMin] = useState<string>("")
    const [priceMax, setPriceMax] = useState<string>("")
    const [dateMin, setDateMin] = useState<string>("")
    const [dateMax, setDateMax] = useState<string>("")
    const [applyFilters, setApplyFilters] = useState<boolean>(false)
    const [resetFilters, setResetFilters] = useState<boolean>(false)

    const [GetReceiptsFull] = useLazyQuery<GetReceiptsFullType, GetReceiptsFullVarType>(GET_RECEIPTS_FULL, {
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
        if(!loading && logged){
            let {order_ref} = router.query
            if(!Array.isArray(order_ref)){
                if(order_ref) {
                    if(!uuidValidate(order_ref)) order_ref = undefined
                }
                GetReceiptsFull({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    },
                    variables: {
                        filters: {
                            priceMin: Number(priceMin) || undefined,
                            priceMax: Number(priceMax) || undefined,
                            dateMin: dateMin !== "" ? DateTime.fromISO(dateMin).toJSDate() : undefined,
                            dateMax: dateMax !== "" ? DateTime.fromISO(dateMax).toJSDate() : undefined,
                            order_ref: order_ref
                        }
                    }
                })
            }
        }
    }, [logged, loading])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            let {order_ref} = router.query
            if(!Array.isArray(order_ref)) {
                GetReceiptsFull({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    },
                    variables: {
                        filters: {
                            priceMin: Number(priceMin) || undefined,
                            priceMax: Number(priceMax) || undefined,
                            dateMin: dateMin !== "" ? DateTime.fromISO(dateMin).toJSDate() : undefined,
                            dateMax: dateMax !== "" ? DateTime.fromISO(dateMax).toJSDate() : undefined,
                            order_ref: order_ref
                        }
                    }
                })
                setReTry(true)
            }
        }
    }, [accessToken.token, reTry])
    useEffect(() => {
        if(applyFilters){
            setApplyFilters(false)
            GetReceiptsFull({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                },
                variables: {
                    filters: {
                        priceMin: Number(priceMin) || undefined,
                        priceMax: Number(priceMax) || undefined,
                        dateMin: dateMin !== "" ? DateTime.fromISO(dateMin).toJSDate() : undefined,
                        dateMax: dateMax !== "" ? DateTime.fromISO(dateMax).toJSDate() : undefined
                    }
                }
            })
        }
    }, [applyFilters])
    useEffect(() => {
        if(resetFilters){
            setResetFilters(false)
            setPriceMin("")
            setPriceMax("")
            setDateMin("")
            setDateMax("")
            setApplyFilters(true)
        }
    }, [resetFilters])

    if(loading) {
        return (
            <>
                <MetaReceipts/>
                <PageLoader display={true}/>
            </>
        )
    }
    if(!logged) {
        let redirect = router.query.order_ref ? ("=" + router.query.order_ref) : ""
        router.push("/login?receipts" + redirect)
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <MetaReceipts/>
            <h1 className="text-3xl">My Receipts</h1>
            <OrdersReceiptsFilters
                priceMin={{value: priceMin, set: setPriceMin}}
                priceMax={{value: priceMax, set: setPriceMax}}
                dateMin={{value: dateMin, set: setDateMin}}
                dateMax={{value: dateMax, set: setDateMax}}
                setApplyFilters={setApplyFilters}
                setResetFilters={setResetFilters}
            />
            {
                receipts.length === 0 &&
                <div className="w-full p-8 bg-neutral-100 smxl:text-3xl text-2xl flex items-center justify-center">
                    <span className="text-neutral-500 text-center">We are Sorry, No Receipt Has Been Found</span>
                </div>
            }
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

export default Receipts;