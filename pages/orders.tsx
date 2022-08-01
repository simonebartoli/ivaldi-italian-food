import React, {useEffect, useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/orders/description";
import ProductsList from "../components/orders/products-list";
import Filters from "../components/orders/Filters";
import PageLoader from "../components/page-loader";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import {AddressReactType} from "./checkout";
import {NextPage} from "next";

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
    query GET_ORDERS_FULL {
        getOrders_FULL {
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
                billing_address {
                    first_address
                    second_address
                    postcode
                    city
                    country
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


const Orders = () => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [orders, setOrders] = useState<GetOrdersFullType["getOrders_FULL"]>([])

    const router = useRouter()
    const [GetOrdersFull] = useLazyQuery<GetOrdersFullType>(GET_ORDERS_FULL, {
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
            GetOrdersFull({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [loading, logged])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            GetOrdersFull({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
            setReTry(true)
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
            <h1 className="text-3xl">My Orders</h1>
            <Filters/>
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