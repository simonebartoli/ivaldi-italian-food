import React, {useEffect, useRef, useState} from 'react';
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {ApolloError, gql} from "@apollo/client";
import {AddressReactType} from "../../../pages/checkout";
import {apolloClient} from "../../../pages/_app";
import {NextPage} from "next";
import {useAuth} from "../../../contexts/auth-context";
import {useRouter} from "next/router";

const paypalOptions = {
    "client-id": "AWYmCr81BL6nv5eBe3hBhbUkz_1qTluKTaLoHGYdf5VZ9esKpROL1NtXHV4hq6I-vsWNyJHRGeSRrft3",
    "commit": true,
    "currency": "GBP",
    "disable-funding": "card,credit,paylater,bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sofort,venmo,sepa"
}

// CREATE ORDER PAYPAL
const CREATE_OR_RETRIEVE_PAYPAL_PAYMENT_INTENT = gql`
    mutation CREATE_OR_RETRIEVE_PAYPAL_PAYMENT_INTENT($data: CreatePaymentIntentInput!){
        createOrRetrievePaypalPaymentIntent(data: $data)
    }
`
type CreateOrRetrievePaypalPaymentIntentType = {
    createOrRetrievePaypalPaymentIntent: string
}
type CreateOrRetrievePaypalPaymentIntentVarType = {
    data: {
        shipping_address: AddressReactType,
        billing_address: AddressReactType,
        phone_number: string,
        delivery_suggested?: string
    }
}
// --------------------------------------------------------

// CAPTURE PAYMENT PAYPAL
const CONFIRM_PAYPAL_PAYMENT = gql`
    mutation CONFIRM_PAYPAL_PAYMENT($data: ConfirmPaymentInput!) {
        confirmPaypalPayment(data: $data)
    }
`
type ConfirmPaypalPaymentType = {
    confirmPaypalPayment: string
}
type confirmPaypalPaymentVarType = {
    data: {
        payment_intent_id: string
    }
}
// --------------------------------------------------------


type Props = {
    shipping_address: AddressReactType,
    billing_address: AddressReactType,
    phone_number: string,
    delivery_suggested?: string
}

const CheckoutPayPal: NextPage<Props> = ({shipping_address, billing_address, phone_number, delivery_suggested}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const accessTokenPaypalCopy = useRef(accessToken)
    const reTry = useRef(false)
    const resolveRef = useRef<((value: unknown) => void) | null>(null)

    const delay = (ms: number) => {
        return new Promise(resolve => {
            // timer.current = setTimeout(() => resolve, ms)
            resolveRef.current = resolve
        })
    }

    const createOrder = async (): Promise<string> => {
        try{
            const {data} = await apolloClient.mutate<CreateOrRetrievePaypalPaymentIntentType, CreateOrRetrievePaypalPaymentIntentVarType>({
                mutation: CREATE_OR_RETRIEVE_PAYPAL_PAYMENT_INTENT,
                context: {
                    headers: {
                        authorization: "Bearer " + accessTokenPaypalCopy.current.token,
                    }
                },
                variables: {
                    data: {
                        shipping_address: shipping_address,
                        billing_address: billing_address,
                        phone_number: phone_number,
                        delivery_suggested: delivery_suggested
                    }
                },

            })
            return data!.createOrRetrievePaypalPaymentIntent
        } catch (e) {
            const result = await handleAuthErrors(e as ApolloError)
            if(result){
                reTry.current = true
                await delay(10000)
                // console.log("HERE " + accessTokenPaypalCopy.current.token)
                return await createOrder()
            }
            throw new Error("There is a problem")
        }
    }
    const capturePayment = async (payment_intent_id: string): Promise<void> => {
        try{
            const {data} = await apolloClient.mutate<ConfirmPaypalPaymentType, confirmPaypalPaymentVarType>({
                mutation: CONFIRM_PAYPAL_PAYMENT,
                context: {
                    headers: {
                        authorization: "Bearer " + accessTokenPaypalCopy.current.token,
                    }
                },
                variables: {
                    data: {
                        payment_intent_id: payment_intent_id
                    }
                },

            })
        } catch (e) {
            const result = await handleAuthErrors(e as ApolloError)
            if(result){
                reTry.current = true
                await delay(10000)
                // console.log("HERE " + accessTokenPaypalCopy.current.token)
                return await capturePayment(payment_intent_id)
            }
            throw new Error("There is a problem")
        }
    }

    useEffect(() => {
        if(accessToken.token !== null){
            if(reTry.current && resolveRef.current !== null){
                reTry.current = false
                // console.log("HERE 2 " + accessToken.token)
                resolveRef.current("Resolved")
            }
            accessTokenPaypalCopy.current = accessToken
        }
    }, [accessToken])


    return (
        <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons className={"w-full z-0"}
                           createOrder={async (data, actions) => {
                               return await createOrder()
                           }}
                           onApprove={async (data, actions) => {
                               await capturePayment(data.orderID)
                               router.push("/confirmation")
                           }}
                           onError={(err) => {
                               setError(err.message as string)
                           }}
            />
            {error !== null && <span className="text-lg text-red-600 text-center">{error}</span>}
        </PayPalScriptProvider>
    );
};

export default CheckoutPayPal;