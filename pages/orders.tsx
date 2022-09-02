import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/orders/description";
import ProductsList from "../components/orders/products-list";
import OrdersReceiptsFilters from "../components/library/orders-receipts-filters";
import PageLoader from "../components/page-loader";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import {AddressReactType} from "./checkout";
import {NextPage} from "next";
import {DateTime} from "luxon";
import { validate as uuidValidate } from 'uuid';
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";

type GetOrdersFullVarType = {
    filters: {
        priceMin?: number
        priceMax?: number,
        dateMin?: Date,
        dateMax?: Date,
        order_ref?: string
    }
}
type GetOrdersFullType = {
    getOrders_FULL: OrderType[]
}
type OrderType = {
    order_id: string
    datetime: string
    shipping_cost: number
    status: string
    price_total: number
    vat_total: number
    archive: ArchiveType
    reference: string
}

type ArchiveType = {
    shipping_address: AddressReactType
    billing_address: AddressReactType
    items: ItemType[]
}
export type ItemType = {
    item_id: number
    price_total: number
    photo_loc: string
    name: string
    price_unit: string
    price_per_unit: number
    vat: number
    amount: number
}

const GET_ORDERS_FULL = gql`
    query GET_ORDERS_FULL($filters: OrderReceiptFilters!) {
        getOrders_FULL(filters: $filters) {
            order_id
            datetime
            vat_total
            shipping_cost
            status
            price_total
            reference
            archive {
                shipping_address {
                    first_address
                    second_address
                    postcode
                    city
                    notes
                }
                items {
                    item_id
                    price_total
                    amount
                    name
                    price_unit
                    price_per_unit
                    photo_loc
                    vat
                }
            }
        }
    }
`

const MetaOrders = () => {
    return (
        <Head>
            <title>{`Orders - Ivaldi Italian Food`}</title>
            <meta name="description" content={"Access all the details of your orders here."}/>
            <meta name="keywords" content={"login,private,dashboard,orders,receipts,email,password,security,details,prices"}/>
            <meta name="robots" content="index, follow"/>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="language" content="English"/>
            <meta name="revisit-after" content="5 days"/>
            <meta name="author" content="Ivaldi Italian Food"/>

            <meta property="og:title" content={`Orders - Ivaldi Italian Food`}/>
            <meta property="og:site_name" content={HOST}/>
            <meta property="og:url" content={`${HOST}/orders`}/>
            <meta property="og:description" content={"Access all the details of your orders here."}/>
            <meta property="og:type" content="product"/>

            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content={TWITTER_USERNAME}/>
            <meta name="twitter:title" content={`${HOST}/orders`}/>
            <meta name="twitter:description" content={"Access all the details of your orders here."}/>
        </Head>
    )
}


const Orders = () => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [orders, setOrders] = useState<GetOrdersFullType["getOrders_FULL"]>([])

    const [priceMin, setPriceMin] = useState<string>("")
    const [priceMax, setPriceMax] = useState<string>("")
    const [dateMin, setDateMin] = useState<string>("")
    const [dateMax, setDateMax] = useState<string>("")
    const [applyFilters, setApplyFilters] = useState<boolean>(false)
    const [resetFilters, setResetFilters] = useState<boolean>(false)

    const router = useRouter()
    const [GetOrdersFull] = useLazyQuery<GetOrdersFullType, GetOrdersFullVarType>(GET_ORDERS_FULL, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setOrders(data.getOrders_FULL)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            console.error(error.message)
        }
    })

    useEffect(() => {
        if(!loading && logged){
            let {order_ref} = router.query
            if(!Array.isArray(order_ref)){
                if(order_ref) {
                    if(!uuidValidate(order_ref)) order_ref = undefined
                }
                GetOrdersFull({
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
    }, [loading, logged])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            let {order_ref} = router.query
            if(!Array.isArray(order_ref)) {
                GetOrdersFull({
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
            GetOrdersFull({
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
                <MetaOrders/>
                <PageLoader display={true}/>
            </>
        )
    }
    if(!logged) {
        let redirect = router.query.order_ref ? ("=" + router.query.order_ref) : ""
        router.push("/login?orders" + redirect)
        return <PageLoader display/>
    }

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <MetaOrders/>
            <h1 className="text-3xl">My Orders</h1>
            <OrdersReceiptsFilters
                priceMin={{value: priceMin, set: setPriceMin}}
                priceMax={{value: priceMax, set: setPriceMax}}
                dateMin={{value: dateMin, set: setDateMin}}
                dateMax={{value: dateMax, set: setDateMax}}
                setApplyFilters={setApplyFilters}
                setResetFilters={setResetFilters}
            />
            {
                orders.length === 0 &&
                <div className="w-full p-8 bg-neutral-100 smxl:text-3xl text-2xl flex items-center justify-center">
                    <span className="text-neutral-500 text-center">We are Sorry, No Order Has Been Found</span>
                </div>
            }
            {
                orders.map((order) =>
                    <Order order={order} key={order.order_id}/>
                )
            }
        </LayoutPrivate>
    );
};


type OrderProps = {
    order: OrderType
}
const Order: NextPage<OrderProps> = ({order}) => {
    const [orderOpen, setOrderOpen] = useState(false)

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md">
            <Description
                orderOpen={orderOpen}
                setOrderOpen={setOrderOpen}
                order={{
                    price_total: order.price_total,
                    status: order.status,
                    datetime: order.datetime
                }}
            />
            {
                orderOpen ?
                    <ProductsList
                        items={order.archive.items}
                        summary={{
                            price_total: order.price_total,
                            vat_total: order.vat_total,
                            reference: order.reference,
                            shipping_address: order.archive.shipping_address
                        }}
                    />
                    : null
            }
        </div>
    )
}

export default Orders;