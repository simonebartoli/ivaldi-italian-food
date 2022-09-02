import React, {useEffect, useRef, useState} from 'react';
import CartArticle from "../components/cart/cartArticle";
import CartSummary from "../components/cart/cartSummary";
import {useResizer} from "../contexts/resizer-context";
import {ItemCartType, useCart} from "../contexts/cart-context";
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import PageLoader from "../components/page-loader";
import {useLayoutContext} from "../contexts/layout-context";
import Link from "next/link";
import _ from "lodash";
import {useAuth} from "../contexts/auth-context";
import Head from "next/head";

type GetItemsCartType = {
    getItemsCart: ItemType[]
}
export type ItemType = {
    item_id: number
    name: string
    price_total: number
    vat: {
        percentage: number
    }
    amount_available: number
    amount: number
    price_unit: string
    photo_loc: string
    discount: {
        percentage: number
    } | null
}
const GET_ITEMS_CART = gql`
    query GET_ITEMS_CART($items: [ItemCartInput!]!) {
        getItemsCart(items: $items){
            item_id
            name
            price_total
            vat {
                percentage
            }
            amount_available
            price_unit
            photo_loc
            discount {
                percentage
            }
        }
    }
`

const GET_MINIMUM_ORDER_PRICE = gql`
    query GET_MINIMUM_ORDER_PRICE {
        getMinimumOrderPrice
    }
`
type GetMinimumOrderPriceType = {
    getMinimumOrderPrice: number
}

const Cart = () => {
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const {cart, functions: {updateCart}} = useCart()
    const {logged} = useAuth()

    const fullPageRef = useRef<HTMLDivElement>(null)
    const [render, setRender] = useState(true)
    const [loader, setLoader] = useState(true)
    const [minimumOrderPrice, setMinimumOrderPrice] = useState(0)

    const {loading: loadingGetMinimumOrderPrice} = useQuery<GetMinimumOrderPriceType>(GET_MINIMUM_ORDER_PRICE, {
        onCompleted: (data) => {
            setMinimumOrderPrice(data.getMinimumOrderPrice)
        }
    })
    const [itemsCart, setItemsCart] = useState<Map<number, ItemType>>(new Map())
    const [getItemsCart, {loading}] = useLazyQuery<GetItemsCartType, {items: ItemCartType[]}>(GET_ITEMS_CART, {
        fetchPolicy: "cache-and-network",
        onError: (error) => console.log(error),
        onCompleted: (data) => {
            const result = new Map()
            for(const item of data.getItemsCart){
                result.set(Number(item.item_id), {
                    ...item,
                    amount: cart.get(Number(item.item_id))!,
                    item_id: Number(item.item_id)
                })
            }

            setItemsCart(result)
        }
    })


    useEffect(() => {
        if(render){
            if(cart.size > 0){
                const cartFormatted: ItemCartType[] = []
                for(const [key, value] of cart) cartFormatted.push({item_id: key, amount: value})
                if(cartFormatted.length > 0) {
                    getItemsCart({
                        variables: {
                            items: cartFormatted
                        }
                    })
                }
                setRender(false)
            }
        }
    }, [cart, render])

    useEffect(() => {
        if(cart.size === 0) setItemsCart(new Map())
        else if (!render) {
            const cartComparison = Array.from(cart.entries()).map((element) => {
                return {
                    item_id: element[0],
                    amount: element[1]
                }
            })
            const itemsCartComparison = Array.from(itemsCart.values()).map((element) => {
                return {
                    item_id: element.item_id,
                    amount: element.amount
                }
            })

            const equal = _.isEqual(_.sortBy(cartComparison, ["item_id"]), _.sortBy(itemsCartComparison, ["item_id"]))
            if(!equal) setRender(true)
        }
    }, [cart])

    useEffect(() => {
        updateCart()
    }, [])

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [loading, heightPage, navHeight, itemsCart])


    return (
        <main className="flex flex-col justify-center w-full items-center p-8">
            <Head>
                <title>{`Cart - Ivaldi Italian Food`}</title>
                <meta name="robots" content="noindex, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>
            </Head>
            {((loading || loadingGetMinimumOrderPrice) && loader) ? <PageLoader display/> :
                <>
                    {itemsCart.size === 0 ?
                        <div ref={fullPageRef} className="w-full flex flex-col gap-8 items-center justify-center">
                            <span className="sm:p-14 smx:p-10 p-6 rounded-lg bg-neutral-100 sm:text-5xl smx:text-3xl text-2xl text-neutral-400 h-full text-center">There is NO items in the cart for now...</span>
                            <div className="flex sm:flex-row flex-col gap-8 w-full items-center justify-center">
                                <div className="self-stretch lg:w-1/3 sm:w-1/2 w-full smxl:p-12 p-6 rounded-lg border-neutral-300 border-[1px] flex flex-col items-center justify-between bg-white gap-8">
                                    <span className="text-xl text-center">First Time Here?</span>
                                    <Link href={"/shop"}>
                                        <a className="hover:bg-green-500 transition w-full p-4 bg-green-standard text-lg text-center text-white shadow-lg rounded-lg" href={"/shop"}>Go to Shop</a>
                                    </Link>
                                </div>
                                {!logged &&
                                    <div className="self-stretch lg:w-1/3 sm:w-1/2 w-full smxl:p-12 p-6 rounded-lg border-neutral-300 border-[1px] flex flex-col items-center justify-between bg-neutral-50 gap-8">
                                        <span className="text-xl text-center">Do you have already an Account?</span>
                                        <Link href={"/login?cart"}>
                                            <a className="hover:bg-green-500 transition w-full p-4 bg-green-standard text-lg text-center text-white shadow-lg rounded-lg" href={"/login?cart"}>Login</a>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <article
                            className="w-full flex lg:flex-row flex-col justify-between items-start xlsx:gap-40 smxl:gap-24 gap-16 h-full">
                            {widthPage < 1024 && itemsCart.size > 0 ?
                                <>
                                    <CartSummary
                                        minimumOrderPrice={minimumOrderPrice}
                                        items={itemsCart}
                                    />
                                    <span className="pt-[1px] bg-neutral-500 w-full"/>
                                </> :
                                ""
                            }
                            <section className="flex flex-col gap-20 items-start justify-start basis-2/3 w-full">
                                {Array.from(itemsCart.values()).map((element) =>
                                    <CartArticle setLoader={setLoader}
                                                 setRefetch={setRender}
                                                 items={itemsCart}
                                                 setItems={setItemsCart}
                                                 item={element}
                                                 key={element.item_id}
                                    />
                                )}
                            </section>
                            {widthPage < 1024 ?
                                <span className="pt-[1px] bg-neutral-500 w-full"/> :
                                ""
                            }
                            {
                                itemsCart.size > 0 &&
                                <CartSummary
                                    minimumOrderPrice={minimumOrderPrice}
                                    items={itemsCart}
                                />
                            }
                        </article>
                    }
                </>
            }
        </main>
    );
};

export default Cart;