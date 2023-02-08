import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/orders/description";
import ProductsList from "../components/orders/products-list";
import OrdersReceiptsFilters from "../components/library/orders-receipts-filters";
import PageLoader from "../components/page-loader";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import {ApolloQueryResult, gql, useLazyQuery} from "@apollo/client";
import {AddressReactType} from "./checkout";
import {NextPage} from "next";
import {DateTime} from "luxon";
import { validate as uuidValidate } from 'uuid';
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";
import DeliveredForm from "../components/orders/modal/delivered-form";
import RefundForm from "../components/orders/modal/refund-form";
import TimeslotModal from "../components/orders/modal/timeslot-modal";

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
    shipping_cost_refunded: boolean
    status: string
    phone_number: string
    price_total: number
    vat_total: number
    archive: ArchiveType
    user: UserType
    order_delivery: OrderDeliveryType
    reference: string
    refund: RefundType[] | null
}
type OrderDeliveryType = {
    actual: string | null
    confirmed: string | null
    suggested: string | null
}
type ArchiveType = {
    shipping_address: AddressReactType
    billing_address: AddressReactType
    items: ItemType[]
}
type UserType = {
    name: string
    phone_number: string
    surname: string
    email: string
}
type RefundType = {
    notes: string
    archive: {
        price_total: number
        item_id: number
        amount_refunded: number
    }[]
    datetime: string
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
            shipping_cost_refunded
            status
            price_total
            phone_number
            reference
            refund {
                notes
                archive {
                    item_id
                    amount_refunded
                    price_total
                }
                datetime
            }
            user {
                name
                surname
                email
            }
            order_delivery {
                actual
                confirmed
                suggested
            }
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
    const [GetOrdersFull, {refetch}] = useLazyQuery<GetOrdersFullType, GetOrdersFullVarType>(GET_ORDERS_FULL, {
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
                    <Order refetch={refetch} order={order} key={order.order_id}/>
                )
            }
        </LayoutPrivate>
    );
};


type OrderProps = {
    order: OrderType
    refetch: (variables?: (Partial<GetOrdersFullVarType> | undefined)) => Promise<ApolloQueryResult<GetOrdersFullType>>
}
const Order: NextPage<OrderProps> = ({order, refetch}) => {
    const [orderOpen, setOrderOpen] = useState(false)
    const [deliveredModal, setDeliveredModal] = useState(false)
    const [refundModal, setRefundModal] = useState(false)
    const [timeslotModal, setTimeslotModal] = useState(false)

    const [invalid, setInvalid] = useState(true)

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md">
            <Description
                orderOpen={orderOpen}
                setOrderOpen={setOrderOpen}
                modal={{
                    setDeliveredModal: setDeliveredModal,
                    setRefundModal: setRefundModal,
                    setConfirmTimeslotModal: setTimeslotModal
                }}
                order={{
                    order_delivery: order.order_delivery,
                    price_total: order.price_total,
                    status: order.status,
                    datetime: order.datetime,
                    refund_total: (() => {
                        let total = 0
                        if(order.refund !== null) {
                            order.refund.forEach((_) => {
                                _.archive.forEach(__ => {
                                    total += __.price_total
                                })
                            })
                        }
                        if(order.shipping_cost_refunded) total += order.shipping_cost
                        return total
                    })()
                }}
            />
            {
                orderOpen ?
                    <ProductsList
                        items={order.archive.items}
                        summary={{
                            order_delivery: order.order_delivery,
                            user: order.user,
                            status: order.status,
                            phone_number: order.phone_number,
                            price_total: order.price_total,
                            vat_total: order.vat_total,
                            reference: order.reference,
                            shipping_total: order.shipping_cost,
                            shipping_cost_refunded: order.shipping_cost_refunded,
                            shipping_address: order.archive.shipping_address,
                            refund: order.refund
                        }}
                    />
                    : null
            }
            {
                deliveredModal &&
                <DeliveredForm
                    modalOpen={{
                        value: deliveredModal,
                        set: setDeliveredModal
                    }}
                    refetch={refetch}
                    reference={order.reference}
                />
            }
            {
                refundModal &&
                <RefundForm
                    modalOpen={{
                        value: refundModal,
                        set: setRefundModal
                    }}
                    invalid={{
                        value: invalid,
                        set: setInvalid
                    }}
                    refetch={refetch}
                    order={order}
                />
            }
            {
                timeslotModal &&
                <TimeslotModal
                    modalOpen={{
                        value: timeslotModal,
                        set: setTimeslotModal
                    }}
                    refetch={refetch}
                    reference={order.reference}
                />
            }
        </div>
    )
}

export default Orders;
export type {OrderType, OrderDeliveryType, RefundType}