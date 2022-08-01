import React, {forwardRef, useEffect, useMemo, useState} from 'react';
import CheckoutStripe from "./checkoutStripe";
import SavedCards from "./saved-cards";
import {AddressReactType} from "../../../pages/checkout";
import {gql, useMutation, useQuery} from "@apollo/client";
import Addresses from "./addresses";
import Total from "./total";
import Items from "./items";
import {useCart} from "../../../contexts/cart-context";
import {useAuth} from "../../../contexts/auth-context";
import {useRouter} from "next/router";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    shippingAddress: AddressReactType
    billingAddress: AddressReactType
    phoneNumber: string
}

type CreateOrRetrievePaymentIntentVarType = {
    data: {
        shipping_address: AddressReactType,
        billing_address: AddressReactType,
        phone_number: string,
        delivery_suggested?: string
    }
}
type CreateOrRetrievePaymentIntentType = {
    createOrRetrievePaymentIntent: {
        id: string
        client_secret: string
        amount: number
    }
}

// ITEMS CART TYPES
type Item = {
    name: string
    photo_loc: string
    price_total: number
    price_unit: string
    vat: {
        percentage: number
    }
}
type ItemReact = Item & {item_id: number, amount: number}
type ItemServer = Item & {item_id: string}

type GetItemsCartType = {
    getItemsCart: ItemServer[]
}
type GetItemsCartVarType = {
    items: {
        item_id: number,
        amount: number
    }[]
}
// ------------------------------------------------


const GET_ITEMS_CART = gql`
    query GET_ITEMS_CART ($items: [ItemCart!]!) {
        getItemsCart(items: $items){
            item_id
            name
            photo_loc
            price_total
            price_unit
            vat {
                percentage
            }
        }
    }
`

const CREATE_OR_RETRIEVE_PAYMENT_INTENT = gql`
    mutation CREATE_OR_RETRIEVE_PAYMENT_INTENT($data: CreatePaymentIntentInput!) {
        createOrRetrievePaymentIntent(data: $data){
            id
            client_secret
            amount
        }
    }
`
const stripePromise = loadStripe('pk_test_51LHx5kILFxyKM1maBgbPWiLi1fcn545wLVdmeOUhX62ddzSoBUdLJ53yB2u9LNYdo9upTw7IdCe2nIlNyinYvubC00zipLMrxk');

const FinalIndex = forwardRef<HTMLDivElement, Props>(({moveBack, shippingAddress, billingAddress, phoneNumber}, ref) => {
    const router = useRouter()

    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const {cart} = useCart()

    const [paymentIntent, setPaymentIntent] = useState<{ client_secret: string, amount: number, id: string } | null>(null)
    const [reTry, setReTry] = useState(false)

    const [items, setItems] = useState<ItemReact[]>([])
    const total = useMemo<number>(() => {
        let newTotal = 0
        if(items.length === 0) return newTotal
        for(const item of items){
            newTotal += item.price_total * item.amount
        }
        return Number(newTotal.toFixed(2))
    }, [items])
    const vatTotal = useMemo<number>(() => {
        let newTotal = 0
        if(items.length === 0) return newTotal
        for(const item of items){
            newTotal += item.vat.percentage > 0 ? item.price_total * item.amount * (item.vat.percentage / 100) : 0
        }
        return Number(newTotal.toFixed(2))
    }, [items])

    const getCartFormatted = () => {
        const cartFormatted: { item_id: number, amount: number }[] = []
        for(const [key, value] of Array.from(cart.entries())) cartFormatted.push({
            item_id: key,
            amount: value
        })
        return cartFormatted
    }

    const {} = useQuery<GetItemsCartType, GetItemsCartVarType>(GET_ITEMS_CART, {
        variables: {
            items: getCartFormatted()
        },
        onCompleted: (data) => {
            const newItems: ItemReact[] = []
            for(const item of data.getItemsCart){
                if(cart.has(Number(item.item_id))){
                    newItems.push({
                        ...item,
                        item_id: Number(item.item_id),
                        amount: cart.get(Number(item.item_id))!
                    })
                }
            }
            setItems(newItems)
        },
        onError: async () => {
            router.push("/cart")
        }
    })
    const [createOrRetrievePaymentIntent] = useMutation<CreateOrRetrievePaymentIntentType, CreateOrRetrievePaymentIntentVarType>(CREATE_OR_RETRIEVE_PAYMENT_INTENT, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: (data) => {
            console.log(data.createOrRetrievePaymentIntent.client_secret)
            setPaymentIntent({
                id: data.createOrRetrievePaymentIntent.id,
                client_secret: data.createOrRetrievePaymentIntent.client_secret,
                amount: data.createOrRetrievePaymentIntent.amount
            })
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
        if(total !== 0){
            createOrRetrievePaymentIntent({
                variables: {
                    data: {
                        billing_address: billingAddress,
                        shipping_address: shippingAddress,
                        phone_number: phoneNumber
                    }
                }
            })
        }
    }, [total])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            createOrRetrievePaymentIntent({
                variables: {
                    data: {
                        billing_address: billingAddress,
                        shipping_address: shippingAddress,
                        phone_number: phoneNumber
                    }
                }
            })
        }
    }, [accessToken, reTry])

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center w-1/2 gap-8 py-8">
            <h2 className="text-3xl">Checkout</h2>
            <Addresses shippingAddress={shippingAddress} billingAddress={billingAddress}/>
            <div className="p-4 flex flex-row gap-4 text-lg items-start w-full">
                <span className="font-semibold">Phone Number:</span>
                <span>{phoneNumber}</span>
            </div>
            <span className="w-full border-t-[1px] border-neutral-300"/>
            <Total total={total} vatTotal={vatTotal}/>
            <Items items={items.map((element) => {
                return {
                    ...element,
                    price_per_unit: element.price_total,
                    price_total: Number((element.price_total*element.amount).toFixed(2)),
                    vat: element.vat.percentage
                }
            })}/>
            <span className="w-full border-t-[1px] border-neutral-300"/>
            <SavedCards/>
            <span className="mt-4 w-full border-t-[1px] border-neutral-300"/>
            {
                paymentIntent &&
                <Elements stripe={stripePromise}>
                    <CheckoutStripe billingAddress={billingAddress} paymentIntent={paymentIntent}/>
                </Elements>
            }
        </section>
    );
});

FinalIndex.displayName = "Final"
export default FinalIndex;