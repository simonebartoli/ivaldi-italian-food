import React, {useEffect, useMemo, useState} from 'react';
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement, PaymentRequestButtonElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import {BsCreditCard2FrontFill, BsFillCalendar2WeekFill} from "react-icons/bs";
import {FaLock} from "react-icons/fa";
import CSS from "csstype";
import {
    PaymentRequest,
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

enum ElementEnum {
    CARD,
    DATE,
    CVC
}

type Props = {
    paymentIntent: {
        client_secret: string,
        amount: number
    }
    billingAddress: AddressReactType
}

const CheckoutForm: NextPage<Props> = ({paymentIntent, billingAddress}) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter()

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

    const [cardIconColor, setCardIconColor] = useState<CSS.Properties | undefined>(undefined)
    const [calendarIconColor, setCalendarIconColor] = useState<CSS.Properties | undefined>(undefined)
    const [cvcIconColor, setCvcIconColor] = useState<CSS.Properties | undefined>(undefined)

    const disabled = useMemo(() => {
        return (cardError !== false || calendarError !== false || cvcError !== false)
    }, [cardError, calendarError, cvcError])
    const [loading, setLoading] = useState(false)

    const [paymentRequest, setPaymentRequest] = useState<null | PaymentRequest>(null);



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


        const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
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
            },
            save_payment_method: saveCardDetails,
        });
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            setError(result.error.message as string);
            setLoading(false)
        } else {
            router.replace("/confirmation")
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
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

    return (
        <section className="flex flex-col items-center justify-center gap-8 py-8 w-full">
            <h2 className="text-3xl mb-8">Your Payment Details</h2>
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

            <form onSubmit={(e) => handleCardPaymentFormSubmit(e)} className="w-full flex flex-col gap-14">
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
                        disabled={(elements === null || disabled || loading)}>
                    {
                        loading ? <Bars height={24} color={"white"}/> : "Submit"
                    }
                </button>
                {error !== null && <span className="text-lg text-red-600 text-center">{error}</span>}
            </form>
        </section>
    );
};

export default CheckoutForm;