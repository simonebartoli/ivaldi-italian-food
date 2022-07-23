import React, {useState} from 'react';
import LayoutPrivate from "../components/layout-private";

import Description from "../components/orders/description";
import ProductsList from "../components/orders/products-list";
import Filters from "../components/orders/Filters";
import PageLoader from "../components/page-loader";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";

const Orders = () => {
    const {loading, logged} = useAuth()
    const router = useRouter()

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
                new Array(5).fill([]).map((_, index) =>
                    <Order key={index}/>
                )
            }
        </LayoutPrivate>
    );
};

const Order = () => {
    const [orderOpen, setOrderOpen] = useState(false)

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md">
            <Description orderOpen={orderOpen} setOrderOpen={setOrderOpen}/>
            {
                orderOpen ?
                    <ProductsList/>
                    : null
            }
        </div>
    )
}

export default Orders;