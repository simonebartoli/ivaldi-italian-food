import React, {useEffect, useState} from 'react';
import CartArticle from "../components/cart/cartArticle";
import CartSummary from "../components/cart/cartSummary";
import {useResizer} from "../contexts/resizer-context";
import {ItemCartType, useCart} from "../contexts/cart-context";
import {gql, useLazyQuery} from "@apollo/client";
import PageLoader from "../components/page-loader";

type GetItemsCartType = {
    getItemsCart: ItemType[]
}
type ItemType = {
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
    const {widthPage} = useResizer()
    const {cart} = useCart()

    const [ready, setReady] = useState(false)
    const [firstRender, setFirstRender] = useState(true)

    const [itemsCart, setItemsCart] = useState<ItemType[]>([])
    const [getItemsCart, {loading}] = useLazyQuery<GetItemsCartType, {items: ItemCartType[]}>(GET_ITEMS_CART, {
        onError: (error) => console.log(error),
        onCompleted: (data) => {
            const result = data.getItemsCart.map((element) => {
                return {
                    ...element,
                    amount: cart.get(Number(element.item_id))!,
                    item_id: Number(element.item_id)
                }
            })
            setItemsCart(result)
        }
    })


    useEffect(() => {
        if(firstRender){
            if(cart.size > 0){
                const cartFormatted: ItemCartType[] = []
                for(const [key, value] of cart) cartFormatted.push({item_id: key, amount: value})
                if(cartFormatted.length > 0) getItemsCart({
                    variables: {
                        items: cartFormatted
                    }
                })
                setFirstRender(false)
            }
        }
    }, [cart, firstRender])

    const getCartSummary = () => {
        return itemsCart.map((element) => {
            return {
                price_total: element.price_total,
                vat_percentage: element.vat.percentage,
                discount_percentage: element.discount?.percentage,
                amount: element.amount
            }
        })
    }

    useEffect(() => {setReady(true)}, [])

    return (
        <main className="flex flex-col justify-center w-full items-center p-8">
            {loading ? <PageLoader display/> :
                <article
                    className="w-full flex lg:flex-row flex-col justify-between items-start xlsx:gap-40 smxl:gap-24 gap-16 h-full">
                    {ready && widthPage < 1024 ?
                        <>
                            <CartSummary
                                items={getCartSummary()}
                            />
                            <span className="pt-[1px] bg-neutral-500 w-full"/>
                        </> :
                        ""
                    }
                    <section className="flex flex-col gap-20 items-start justify-start basis-2/3 w-full">
                        {itemsCart.map((element, index) =>
                            <CartArticle item={element} key={index}/>
                        )}
                    </section>
                    {ready && widthPage < 1024 ?
                        <span className="pt-[1px] bg-neutral-500 w-full"/> :
                        ""
                    }
                    <CartSummary
                        items={getCartSummary()}
                    />
                </article>
            }
        </main>
    );
};

export default Cart;