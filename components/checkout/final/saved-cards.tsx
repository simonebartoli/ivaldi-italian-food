import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useAuth} from "../../../contexts/auth-context";
import {DateTime} from "luxon";
import {NextPage} from "next";
import {useStripe} from "@stripe/react-stripe-js";
import {Bars} from "react-loader-spinner";
import {SERVER_ERRORS_ENUM} from "../../../enums/SERVER_ERRORS_ENUM";
import {useRouter} from "next/router";
import PageLoader from "../../page-loader";
import ActionStopper from "../../library/action-stopper";
import {useResizer} from "../../../contexts/resizer-context";

// --------------------------------------
// GET PAYMENT METHODS
type GetPaymentMethodType = {
    getPaymentMethods: PaymentMethodType[]
}
type PaymentMethodType = {
    payment_method_id: string
    last4: string
    exp_date: string
    brand: string
}
const GET_PAYMENT_METHODS = gql`
    query GET_PAYMENT_METHODS {
        getPaymentMethods {
            payment_method_id
            last4
            exp_date
            brand
        }
    }
`
// --------------------------------------

// --------------------------------------
// GET CVC TOKEN
const CREATE_CVC_TOKEN = gql`
    mutation CREATE_CVC_TOKEN($data: CreateCVCTokenInput!){
        createCVCToken(data: $data)
    }
`
type CreateCVCTokenVarType = {
    data: {
        cvc: string
    }
}
type CreateCVCTokenType = {
    createCVCToken: string
}
// --------------------------------------

// --------------------------------------
// CONFIRM PAYMENT WITH CVC
const CONFIRM_PAYMENT = gql`
    mutation CONFIRM_PAYMENT($data: ConfirmPaymentInput!) {
        confirmPayment(data: $data)
    }
`
type ConfirmPaymentVarType = {
    data: {
        payment_intent_id: string
        cvc?: string
    }
}
type ConfirmPaymentType = {
    confirmPayment: boolean
}
// --------------------------------------

// --------------------------------------
// ADD PAYMENT METHOD TO PAYMENT INTENT
const ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT = gql`
    mutation ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT ($data: AddPaymentMethodToPaymentIntentInput!) {
        addPaymentMethodToPaymentIntent(data: $data)
    }
`
type AddPaymentMethodToPaymentIntentVarType = {
    data: {
        payment_intent_id: string,
        payment_method_id: string,
        save_card: boolean,
        cvc?: string
    }
}
type AddPaymentMethodToPaymentIntentType = {
    addPaymentMethodToPaymentIntent: boolean
}
// --------------------------------------


type Props = {
    paymentIntent: {
        id: string
        client_secret: string,
        amount: number
    }}

const SavedCards: NextPage<Props> = ({paymentIntent}) => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [savedCards, setSavedCards] = useState<PaymentMethodType[]>([])

    const [GetPaymentMethods, {loading: paymentMethodsLoading}] = useLazyQuery<GetPaymentMethodType>(GET_PAYMENT_METHODS, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setSavedCards(data.getPaymentMethods)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            console.log(error.message)
        }
    })

    useEffect(() => {
        if(!loading && logged) {
            GetPaymentMethods({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [loading, logged])
    useEffect(() => {
        if(accessToken.token !== null && reTry) {
            setReTry(false)
            GetPaymentMethods({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [accessToken.token, reTry])

    if(paymentMethodsLoading){
        return <PageLoader display/>
    }

    return (
        <div className="flex flex-col gap-6 w-full items-center justify-center">
            <h3 className="text-3xl my-6">Your Saved Cards</h3>
            {savedCards.length === 0 ?
                <div className="w-full text-neutral-500 rounded-lg shadow-md p-10 text-center bg-neutral-100 text-xl">
                    <span>No Cards Saved for Now</span>
                </div>
                :
                savedCards.map((card) =>
                    <Card key={card.payment_method_id}
                          card={card}
                          paymentIntent={paymentIntent}
                    />
                )}
        </div>
    );
};


type CardProps = {
    card: {
        payment_method_id: string
        last4: string
        exp_date: string
        brand: string
    }
    paymentIntent: {
        id: string
        client_secret: string,
        amount: number
    }
}

const Card: NextPage<CardProps> = ({card, paymentIntent}) => {
    const {widthPage} = useResizer()

    const [cvc, setCVC] = useState("")
    const [cvcError, setCVCError] = useState<string | null>("")
    const [error, setError] = useState("")
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const cvcToken = useRef<string | null>(null)

    const [loading, setLoading] = useState(false)
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)
    const actionType = useRef<"NO_ACTION" | "CREATE_CVC_TOKEN" | "ADD_PAYMENT_METHOD" | "CONFIRM_PAYMENT">("NO_ACTION")
    const nextStep = useRef<"ADD_PAYMENT_METHOD" | "CONFIRM_PAYMENT">("ADD_PAYMENT_METHOD")

    const router = useRouter()
    const stripe = useStripe()

    const handleCVCChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setCVC(newValue)

        if(!isNaN(Number(newValue))) {
            if (newValue.length > 2 && newValue.length < 5) {
                setCVCError(null)
            } else {
                setCVCError("CVC Not Valid")
            }
        }else{
            setCVCError("CVC Not Valid")
        }
    }
    const handlePayment = (e: FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault()
        CreateCVCToken({
            variables: {
                data: {
                    cvc: cvc
                }
            }
        })
    }

    const [CreateCVCToken] = useMutation<CreateCVCTokenType, CreateCVCTokenVarType>(CREATE_CVC_TOKEN,{
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: (data) => {
            cvcToken.current = data.createCVCToken
            if(cvcToken.current !== null){
                if(nextStep.current === "ADD_PAYMENT_METHOD"){
                    AddPaymentMethodToPaymentIntent({
                        variables: {
                            data: {
                                payment_intent_id: paymentIntent.id,
                                payment_method_id: card.payment_method_id,
                                save_card: false,
                                // cvc: cvcToken.current
                            }
                        }
                    })
                }else if(nextStep.current === "CONFIRM_PAYMENT"){
                    // PASSING FROM HERE MEANS 3D SECURE CHECK
                    ConfirmPayment({
                        variables: {
                            data: {
                                payment_intent_id: paymentIntent.id,
                                // cvc: cvcToken.current
                            }
                        }
                    })
                }
            }
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                actionType.current = "CREATE_CVC_TOKEN"
                setReTry(true)
                return
            }
        }
    })
    const [AddPaymentMethodToPaymentIntent] = useMutation<AddPaymentMethodToPaymentIntentType, AddPaymentMethodToPaymentIntentVarType>(ADD_PAYMENT_METHOD_TO_PAYMENT_INTENT, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: async () => {
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
                    setError(result.error.message as string)
                    setLoading(false)
                }else{
                    nextStep.current = "CONFIRM_PAYMENT"
                    CreateCVCToken({
                        variables: {
                            data: {
                                cvc: cvc
                            }
                        }
                    })
                }
            }else{
                setError(error.message)
                setLoading(false)
            }
        }
    })
    const [ConfirmPayment] = useMutation<ConfirmPaymentType, ConfirmPaymentVarType>(CONFIRM_PAYMENT, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            router.replace("/confirmation")
            setLoading(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                actionType.current = "CONFIRM_PAYMENT"
                setReTry(true)
                return
            }
            nextStep.current = "ADD_PAYMENT_METHOD"
            setError(error.message)
            setLoading(false)
        }
    })

    useEffect(() =>{
        if(accessToken.token !== null && reTry) {
            if(actionType.current === "CREATE_CVC_TOKEN"){
                CreateCVCToken({
                    variables: {
                        data: {
                            cvc: cvc
                        }
                    }
                })
            }else if(actionType.current === "ADD_PAYMENT_METHOD" && cvcToken.current !== null){
                AddPaymentMethodToPaymentIntent({
                    variables: {
                        data: {
                            payment_intent_id: paymentIntent.id,
                            payment_method_id: card.payment_method_id,
                            save_card: true,
                            // cvc: cvcToken.current
                        }
                    }
                })
            }else if(actionType.current === "CONFIRM_PAYMENT" && cvcToken.current !== null) {
                ConfirmPayment({
                    variables: {
                        data: {
                            payment_intent_id: paymentIntent.id,
                            // cvc: cvcToken.current
                        }
                    }
                })
            }

            actionType.current = "NO_ACTION"
            setReTry(false)
        }
    }, [accessToken, reTry])

    return (
        <div className="group w-full gap-12 bg-neutral-100 hover:bg-neutral-200 transition shadow-lg rounded-lg flex flex-col justify-center items-center">
            {loading && <ActionStopper/>}
            <div onClick={() => setShowPaymentForm(!showPaymentForm)} className="p-6 text-neutral-700 group-hover:text-black w-full transition cursor-pointer flex smxl:flex-row flex-col justify-between items-center">
                <div className="flex flex-row justify-between items-center smxl:w-2/3 w-full">
                    <div className="w-1/5 flex items-center justify-center">
                        <div className="relative h-[50px] w-full items-center justify-center flex">
                            <Image alt={`${card.brand} Image`} src={`/media/photos/checkout/${card.brand}.png`} layout="fill" objectFit="contain"/>
                        </div>
                    </div>
                    <span className="text-2xl"><span className="text-lg">XXXX XXXX XXXX</span> {card.last4}</span>
                </div>
                <div className="smxl:text-2xl text-lg smxl:w-auto w-full text-right">
                    {widthPage <= 500 ? "Expiry Date: ": ""}{DateTime.fromISO(card.exp_date).toFormat("LL/yy")}
                </div>
            </div>
            <form onSubmit={(e) => handlePayment(e)} style={{display: showPaymentForm ? "flex" : "none"}} className="w-full flex-col gap-4 p-6 pt-0 items-center justify-center">
                <span className="w-full text-left">For Security Reason Please Insert Your CVC Here.</span>
                <div className="flex mb-4 flex-col gap-4 items-center justify-center w-full">
                    <input type="password"
                           autoComplete="cc-csc"
                           onChange={(e) => handleCVCChange(e)}
                           value={cvc}
                           maxLength={4}
                           placeholder={`Insert the CVC of the card *${card.last4} here...`}
                           className="w-full bg-neutral-50 p-3 rounded-lg shadow-md"
                    />
                    {
                        cvcError !== null && cvcError !== "" &&
                        <span className="text-red-600 italic text-right w-full">{cvcError}</span>
                    }
                </div>
                <button type="submit" disabled={cvcError !== null || loading} className="flex items-center justify-center disabled:cursor-not-allowed disabled:bg-neutral-500 w-full text-lg text-white text-center shadow-lg rounded-lg p-4 transition hover:bg-green-500 bg-green-standard">
                    {
                        loading ? <Bars height={24} color={"white"}/> : "Pay Now"
                    }
                </button>
                <span className="text-red-600 italic text-center w-full">{error}</span>
            </form>
        </div>
    )
}

export default SavedCards;