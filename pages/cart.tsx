import React, {useEffect, useRef, useState} from 'react';
import CartArticle from "../components/cart/cartArticle";
import CartSummary from "../components/cart/cartSummary";
import {useResizer} from "../contexts/resizer-context";
import {ItemCartType, useCart} from "../contexts/cart-context";
import {gql, useLazyQuery} from "@apollo/client";
import PageLoader from "../components/page-loader";
import {useLayoutContext} from "../contexts/layout-context";
import Link from "next/link";
import _ from "lodash";

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
    query GET_ITEMS_CART($items: [ItemCart!]!) {
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

const Cart = () => {
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const {cart, functions: {updateCart}} = useCart()

    const fullPageRef = useRef<HTMLDivElement>(null)

    const [ready, setReady] = useState(false)
    const [render, setRender] = useState(true)

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
        setReady(true)
        updateCart()
    }, [])

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [loading, heightPage, navHeight, itemsCart])


    return (
        <main className="flex flex-col justify-center w-full items-center p-8">
            {loading ? <PageLoader display/> :
                <>
                    {itemsCart.size === 0 ?
                        <div ref={fullPageRef} className="w-full flex flex-col gap-8 items-center justify-center">
                            <span className="p-14 rounded-lg bg-neutral-100 text-5xl text-neutral-400 h-full text-center">There is NO items in the cart for now...</span>
                            <Link href={"/shop"}>
                                <a className="hover:bg-green-500 transition w-1/3 p-6 bg-green-standard text-lg text-center text-white shadow-lg rounded-lg" href={"/shop"}>Go to Shop</a>
                            </Link>
                        </div>
                        :
                        <article
                            className="w-full flex lg:flex-row flex-col justify-between items-start xlsx:gap-40 smxl:gap-24 gap-16 h-full">
                            {ready && widthPage < 1024 && itemsCart.size > 0 ?
                                <>
                                    <CartSummary
                                        items={itemsCart}
                                    />
                                    <span className="pt-[1px] bg-neutral-500 w-full"/>
                                </> :
                                ""
                            }
                            <section className="flex flex-col gap-20 items-start justify-start basis-2/3 w-full">
                                {Array.from(itemsCart.values()).map((element) =>
                                    <CartArticle items={itemsCart} setItems={setItemsCart} item={element} key={element.item_id}/>
                                )}
                            </section>
                            {ready && widthPage < 1024 ?
                                <span className="pt-[1px] bg-neutral-500 w-full"/> :
                                ""
                            }
                            {
                                itemsCart.size > 0 &&
                                <CartSummary
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