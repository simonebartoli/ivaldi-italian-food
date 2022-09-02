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
import CheckoutPayPal from "./checkoutPayPal";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    shippingAddress: AddressReactType
    billingAddress: AddressReactType
    delivery_suggested: string
    phoneNumber: string
    items: ItemReact[]
}

// PAYMENT INTENTS CREATE / RETRIEVE
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
// ------------------------------------------------


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
// ------------------------------------------------

const FinalIndex = forwardRef<HTMLDivElement, Props>(({moveBack, shippingAddress, billingAddress, phoneNumber, delivery_suggested, items}, ref) => {

    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const [paymentIntent, setPaymentIntent] = useState<{ client_secret: string, amount: number, id: string } | null>(null)
    const [reTry, setReTry] = useState(false)

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
            toast.error("The Data Inserted Are Not Valid")
            console.log(error.message)
            setTimeout(() => window.location.reload(), 2000)
        }
    })

    useEffect(() => {
        if(total !== 0){
            createOrRetrievePaymentIntent({
                variables: {
                    data: {
                        billing_address: billingAddress,
                        shipping_address: shippingAddress,
                        phone_number: phoneNumber,
                        delivery_suggested: delivery_suggested
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
                        phone_number: phoneNumber,
                        delivery_suggested: delivery_suggested
                    }
                }
            })
        }
    }, [accessToken, reTry])

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center xls:w-1/2 mdx:w-2/3 md:w-3/4 w-full gap-8 py-8">
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
            {
                paymentIntent &&
                <Elements stripe={stripePromise}>
                    <SavedCards paymentIntent={paymentIntent}/>
                </Elements>
            }
            <span className="mt-4 w-full border-t-[1px] border-neutral-300"/>
            <section className="flex flex-col items-center justify-center gap-8 py-8 w-full">
                <h2 className="text-3xl mb-8">Your Payment Details</h2>
                <CheckoutPayPal shipping_address={shippingAddress}
                                billing_address={billingAddress}
                                phone_number={phoneNumber}
                                delivery_suggested={delivery_suggested}
                />
                {
                    paymentIntent &&
                    <Elements stripe={stripePromise}>
                        <CheckoutStripe billingAddress={billingAddress} paymentIntent={paymentIntent}/>
                    </Elements>
                }
            </section>
        </section>
    );
});

FinalIndex.displayName = "Final"
export default FinalIndex;