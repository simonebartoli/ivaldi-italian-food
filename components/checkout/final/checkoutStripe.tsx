import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement, PaymentRequestButtonElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import {BsCreditCard2Back, BsCreditCard2FrontFill, BsFillCalendar2WeekFill} from "react-icons/bs";
import {FaLock} from "react-icons/fa";
import CSS from "csstype";
import {
    PaymentRequest, PaymentRequestPaymentMethodEvent,
    StripeCardCvcElementChangeEvent,
    StripeCardExpiryElementChangeEvent,
    StripeCardNumberElementChangeEvent
} from "@stripe/stripe-js";
import {NextPage} from "next";
import {Bars} from "react-loader-spinner";
import {AddressReactType} from "../../../pages/checkout";
import {useRouter} from "next/router";
import {countries} from "../../../static-data/countries";
import {DateTime} from "luxon";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../../contexts/auth-context";
import {SERVER_ERRORS_ENUM} from "../../../enums/SERVER_ERRORS_ENUM";
import PageLoader from "../../page-loader";

const ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT = gql`
    mutation ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT ($data: AddPaymentMethodToPaymentIntentInput!) {
        addPaymentMethodToPaymentIntent(data: $data)
    }
`
const CONFIRM_PAYMENT = gql`
    mutation CONFIRM_PAYMENT ($data: ConfirmPaymentInput!) {
        confirmPayment(data: $data)
    }
`

enum ElementEnum {
    CARD,
    DATE,
    CVC
}


type AddPaymentMethodToPaymentIntentVarType = {
    data: {
        payment_intent_id: string,
        payment_method_id: string,
        save_card: boolean
    }
}
type ConfirmPaymentVarType = {
    data: {
        payment_intent_id: string
        cvc?: string
    }
}
type Props = {
    paymentIntent: {
        id: string
        client_secret: string,
        amount: number
    }
    billingAddress: AddressReactType
}

const CheckoutStripe: NextPage<Props> = ({paymentIntent, billingAddress}) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter()
    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const [error, setError] = useState<string | null>(null)
    const [options] = useState({
        style: {
            base: {
                fontSize: "1.25rem"
            }
        }
    })

    const [saveCardDetails, setSaveCardDetails] = useState(true)

    const [cardError, setCardError] = useState<string | false | "REQUIRED">("REQUIRED")
    const [calendarError, setCalendarError] = useState<string | false | "REQUIRED">("REQUIRED")
    const [cvcError, setCvcError] = useState<string | false | "REQUIRED">("REQUIRED")
    const paymentMethodId = useRef<string>("")

    const [cardIconColor, setCardIconColor] = useState<CSS.Properties | undefined>(undefined)
    const [calendarIconColor, setCalendarIconColor] = useState<CSS.Properties | undefined>(undefined)
    const [cvcIconColor, setCvcIconColor] = useState<CSS.Properties | undefined>(undefined)

    const disabled = useMemo(() => {
        return (cardError !== false || calendarError !== false || cvcError !== false)
    }, [cardError, calendarError, cvcError])
    const [loading, setLoading] = useState(false)
    const [showAddNewCard, setShowAddNewCard] = useState(false)

    const [reTry, setReTry] = useState(false)
    const actionType = useRef<"NO_ACTION" | "ADD_PAYMENT_METHOD" | "CONFIRM_PAYMENT">("NO_ACTION")

    const [paymentRequest, setPaymentRequest] = useState<null | PaymentRequest>(null);
    const walletPaymentEvent = useRef<null | PaymentRequestPaymentMethodEvent>(null)
    const paymentButtonEventHandlerRenderRef = useRef(true)

    const [AddPaymentMethodToPaymentIntent] = useMutation<boolean, AddPaymentMethodToPaymentIntentVarType>(ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: async () => {
            if(walletPaymentEvent.current !== null) walletPaymentEvent.current?.complete("success")
            router.replace("/confirmation")
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                actionType.current = "ADD_PAYMENT_METHOD"
                setReTry(true)
                return
            }
            if(error.graphQLErrors[0].extensions.type === SERVER_ERRORS_ENUM.PAYMENT_REQUIRES_ACTIONS){
                console.log("TO CONFIRM")
                const result = await stripe!.handleCardAction(paymentIntent.client_secret)
                if(result.error){
                    if(walletPaymentEvent.current !== null) walletPaymentEvent.current?.complete("fail")
                    setError(result.error.message as string)
                    setLoading(false)
                }else{
                    ConfirmPayment({
                        variables: {
                            data: {
                                payment_intent_id: paymentIntent.id
                            }
                        }
                    })
                }
            }else{
                if(walletPaymentEvent.current !== null) walletPaymentEvent.current?.complete("fail")
                setError(error.message)
                setLoading(false)
            }
        }
    })
    const [ConfirmPayment] = useMutation<boolean, ConfirmPaymentVarType>(CONFIRM_PAYMENT, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            if(walletPaymentEvent.current !== null) walletPaymentEvent.current?.complete("success")
            router.replace("/confirmation")
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                actionType.current = "CONFIRM_PAYMENT"
                setReTry(true)
                return
            }
            if(walletPaymentEvent.current !== null) walletPaymentEvent.current?.complete("fail")
            setError(error.message)
            setLoading(false)
        }
    })

    const handleInputError = (e: StripeCardNumberElementChangeEvent | StripeCardExpiryElementChangeEvent | StripeCardCvcElementChangeEvent, type: ElementEnum) => {
        if(e.error){
            switch (type){
                case ElementEnum.CARD:
                    setCardError(e.error.message)
                    setCardIconColor({color: "rgb(220 38 38)"})
                    break
                case ElementEnum.DATE:
                    setCalendarError(e.error.message)
                    setCalendarIconColor({color: "rgb(220 38 38)"})
                    break
                case ElementEnum.CVC:
                    setCvcError(e.error.message)
                    setCvcIconColor({color: "rgb(220 38 38)"})
                    break
            }
        }else if (e.complete){
            switch (type){
                case ElementEnum.CARD:
                    setCardError(false)
                    setCardIconColor(undefined)
                    break
                case ElementEnum.DATE:
                    setCalendarError(false)
                    setCalendarIconColor(undefined)
                    break
                case ElementEnum.CVC:
                    setCvcError(false)
                    setCvcIconColor(undefined)
                    break
            }
        }else{
            switch (type){
                case ElementEnum.CARD:
                    setCardError("REQUIRED")
                    setCardIconColor(undefined)
                    break
                case ElementEnum.DATE:
                    setCalendarError("REQUIRED")
                    setCalendarIconColor(undefined)
                    break
                case ElementEnum.CVC:
                    setCvcError("REQUIRED")
                    setCvcIconColor(undefined)
                    break
            }
        }
    }
    const handleCardPaymentFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        setLoading(true)
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement("cardNumber")!,
            billing_details: {
                address: {
                    line1: billingAddress.first_address,
                    line2: billingAddress.second_address ? billingAddress.second_address : undefined,
                    postal_code: billingAddress.postcode,
                    city: billingAddress.city,
                    country: countries.find((element) => element.name === billingAddress.country)!.code
                }
            }
        })

        console.log(result)
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            setError(result.error.message as string);
        } else {
            paymentMethodId.current = result.paymentMethod.id
            AddPaymentMethodToPaymentIntent({
                variables: {
                    data: {
                        payment_intent_id: paymentIntent.id,
                        payment_method_id: result.paymentMethod.id,
                        save_card: saveCardDetails
                    }
                }
            })
        }
    };


    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'GB',
                currency: 'gbp',
                total: {
                    label: 'Ivaldi Italian Food Order - ' + DateTime.now().toISO(),
                    amount: paymentIntent.amount,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            // Check the availability of the Payment Request API.
            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });
        }
    }, [stripe]);
    useEffect(() => {
        if(stripe && paymentRequest && paymentButtonEventHandlerRenderRef.current){
            paymentButtonEventHandlerRenderRef.current = false
            paymentRequest.on('paymentmethod', async (ev) => {
                // Confirm the PaymentIntent without handling potential next actions (yet).
                paymentMethodId.current = ev.paymentMethod.id
                walletPaymentEvent.current = ev
                AddPaymentMethodToPaymentIntent({
                    variables: {
                        data: {
                            payment_intent_id: paymentIntent.id,
                            payment_method_id: ev.paymentMethod.id,
                            save_card: false
                        }
                    }
                })
            });
        }
    }, [stripe, paymentRequest])
    useEffect(() => {
        if(accessToken.token !== null && reTry && actionType.current !== "NO_ACTION"){
            if(actionType.current === "ADD_PAYMENT_METHOD") AddPaymentMethodToPaymentIntent({
                variables: {
                    data: {
                        payment_intent_id: paymentIntent.id,
                        payment_method_id: paymentMethodId.current,
                        save_card: saveCardDetails
                    }
                }
            })
            else if(actionType.current === "CONFIRM_PAYMENT") ConfirmPayment({
                variables: {
                    data: {
                        payment_intent_id: paymentIntent.id
                    }
                }
            })
            actionType.current = "NO_ACTION"
            setReTry(false)
        }
    }, [accessToken.token, reTry])

    if(!stripe || !elements) {
        return <PageLoader display/>
    }

    return (
        <>
            {paymentRequest &&
                <PaymentRequestButtonElement
                    className="w-full transition-all"
                    options={{
                        paymentRequest,
                        style: {
                            paymentRequestButton: {
                                height: "80px"
                        }}
                    }}
                />
            }
            <div className="w-full flex flex-col gap-12 items-center justify-center">
                <span onClick={() => setShowAddNewCard(true)} className="transition hover:shadow-xl cursor-pointer hover:bg-green-500 text-xl flex flex-row items-center justify-center gap-6 text-white bg-green-standard w-full p-4 rounded-lg shadow-lg text-center">
                    Add New Card
                    <BsCreditCard2Back className="text-3xl mt-1"/>
                </span>
                <form style={{display: showAddNewCard ? "flex" : "none"}} onSubmit={(e) => handleCardPaymentFormSubmit(e)} className="w-full flex-col gap-14">
                    <div className="w-full flex flex-col gap-6">
                        <div className="space-y-2">
                            <span>Card Number</span>
                            <div className="relative">
                                <CardNumberElement className="transition-all p-5 bg-neutral-100 rounded-xl text-lg "
                                                   onChange={(e) => handleInputError(e, ElementEnum.CARD)}
                                />
                                <BsCreditCard2FrontFill style={cardIconColor} className="text-3xl absolute top-1/2 right-[1.25rem] -translate-y-1/2"/>
                            </div>
                            <span className="block text-red-600 italic">{cardError !== "REQUIRED" && cardError}</span>
                        </div>
                        <div className="flex flex-row justify-between gap-8">
                            <div className="w-full space-y-2">
                                <span>Expiry Date</span>
                                <div className="relative">
                                    <CardExpiryElement className="transition-all w-full p-5 bg-neutral-100 rounded-xl text-lg"
                                                       onChange={(e) => handleInputError(e, ElementEnum.DATE)}
                                    />
                                    <BsFillCalendar2WeekFill style={calendarIconColor} className="text-2xl absolute top-1/2 right-[1.25rem] -translate-y-1/2"/>
                                </div>
                                <span className="block text-red-600 italic">{calendarError !== "REQUIRED" && calendarError}</span>
                            </div>
                            <div className="w-full space-y-2">
                                <span>CVC</span>
                                <div className="relative">
                                    <CardCvcElement className="transition-all w-full p-5 bg-neutral-100 rounded-xl text-lg"
                                                    onChange={(e) => handleInputError(e, ElementEnum.CVC)}
                                    />
                                    <FaLock style={cvcIconColor} className="text-2xl absolute top-1/2 right-[1.25rem] -translate-y-1/2"/>
                                </div>
                                <span className="block text-red-600 italic">{cvcError !== "REQUIRED" && cvcError}</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-6 items-center justify-start">
                            <input checked={saveCardDetails} onChange={() => setSaveCardDetails(!saveCardDetails)} type="checkbox" className="scale-125"/>
                            <span>Save Your Card Details for Future Purchases</span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-full p-4 text-white text-center text-lg shadow-lg bg-green-standard"
                            disabled={(disabled || loading)}>
                        {
                            loading ? <Bars height={24} color={"white"}/> : "Submit"
                        }
                    </button>
                    {error !== null && <span className="text-lg text-red-600 text-center">{error}</span>}
                </form>
            </div>
        </>
    );
};

export default CheckoutStripe;