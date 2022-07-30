import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import FinalIndex from "../components/checkout/final";
import ShippingAddressList from "../components/checkout/shipping-address-list";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import PageLoader from "../components/page-loader";
import {useCart} from "../contexts/cart-context";
import {gql, useLazyQuery} from "@apollo/client";
import _ from "lodash";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import BillingAddressList from "../components/checkout/billing-address-list";
import DeliveryInfo from "../components/checkout/delivery-info";

// GET CART TYPES
type CartType = {
    amount: number
}
type CartServerType = CartType & {item_id: string}
type CartReactType = CartType & {item_id: number}

type GetCartType = {
    getUserCart: CartServerType[]
}

// ------------------------------------------------


// GET ADDRESSES TYPES
type AddressType = {
    __typename: any
    first_address: string
    second_address: string | null
    postcode: string
    city: string
    notes: string | null
}

type AddressShippingServerType = AddressType & {address_id: string}
type AddressBillingServerType = AddressType & {address_id: string, country: string}

export type AddressReactType = AddressType & {address_id: number, country?: string, __typename: undefined}

type GetAddressesType = {
    getUserInfo: {
        shipping_addresses: AddressShippingServerType[]
        billing_addresses: AddressBillingServerType[]
    }
}
// ------------------------------------------------

// SERVER QUERY
const GET_CART = gql`
    query GET_CART {
        getUserCart {
            item_id
            amount
        }
    }
`
const GET_ADDRESSES = gql`
    query GET_ADDRESSES {
        getUserInfo {
            shipping_addresses {
                address_id
                first_address
                second_address
                postcode
                city
                notes
            }
            billing_addresses {
                address_id
                first_address
                second_address
                postcode
                city
                notes
                country
            }
        }
    }
`
// ------------------------------------------------

enum ACTION_TYPE_ENUM {
    NO_ACTION,
    CART,
    ADDRESSES
}


const Checkout = () => {
    const {accessToken, loading, logged, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const {cart, cartReady} = useCart()

    const router = useRouter()
    const actionType = useRef(ACTION_TYPE_ENUM.NO_ACTION)


    const fullPageRef = useRef<HTMLDivElement>(null)
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const [existingShippingAddresses, setExistingShippingAddresses] = useState<AddressReactType[]>([])
    const [selectedShippingAddress, setSelectedShippingAddress] = useState<null | AddressReactType>(null)
    const [existingBillingAddresses, setExistingBillingAddresses] = useState<AddressReactType[]>([])
    const [selectedBillingAddress, setSelectedBillingAddress] = useState<null | AddressReactType>(null)
    const [renderFetchAddresses, setRenderFetchAddresses] = useState(false)
    const [renderCheckout, setRenderCheckout] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState("+44 ")
    const [deliveryInfo, setDeliveryInfo] = useState("")


    const shippingSectionRef = useRef<HTMLDivElement>(null)
    const billingSectionRef = useRef<HTMLDivElement>(null)
    const deliveryInfoSectionRef = useRef<HTMLDivElement>(null)
    const finalSectionRef = useRef<HTMLDivElement>(null)

    const refs = useRef([shippingSectionRef, billingSectionRef, deliveryInfoSectionRef, finalSectionRef])

    const moveNext = useCallback((oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if(disappearingSection !== null && appearingSection !== null){
            disappearingSection.classList.toggle("animate-slideLeft")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromRight")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideLeft")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromRight")
            }, 500)
        }
    }, [])
    const moveBack = useCallback((oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if (disappearingSection !== null && appearingSection !== null) {
            disappearingSection.classList.toggle("animate-slideRight")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromLeft")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideRight")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromLeft")
            }, 500)
        }
    }, [])


    const checkItemCartAmountAvailable = (data: CartReactType[]) => {
        const localCartComparison: CartReactType[] = []
        for(const [key, amount] of cart.entries()) localCartComparison.push({
            item_id: key,
            amount: amount
        })

        const newDataCartComparison : CartReactType[] = []
        for(const item of data) newDataCartComparison.push({
            item_id: item.item_id,
            amount: item.amount
        })

        const equal = _.isEqual(_.sortBy(localCartComparison, ["item_id"]), _.sortBy(newDataCartComparison, ["item_id"]))
        if(!equal){
            toast.error("Some Items Are No More Available.")
            console.log("ERROR 2")

            router.push("/cart")
        }
    }

    const [getUserCart] = useLazyQuery<GetCartType>(GET_CART, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            const newData: CartReactType[] = []
            for(const item of data.getUserCart) {
                newData.push({
                    item_id: Number(item.item_id),
                    amount: item.amount
                })

            }
            checkItemCartAmountAvailable(newData)

            getAddresses({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType.current = ACTION_TYPE_ENUM.CART
                setReTry(true)
                return
            }
            console.log(error.message)
            router.push("/cart")
        }
    })
    const [getAddresses] = useLazyQuery<GetAddressesType>(GET_ADDRESSES, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const newBillingAddresses: AddressReactType[] = []
            const newShippingAddresses: AddressReactType[] = []

            for(const address of data.getUserInfo.shipping_addresses){
                newShippingAddresses.push({
                    ...address,
                    address_id: Number(address.address_id),
                    __typename: undefined,
                })
            }
            for(const address of data.getUserInfo.billing_addresses){
                newBillingAddresses.push({
                    ...address,
                    __typename: undefined,
                    address_id: Number(address.address_id)
                })
            }
            console.log(data)
            setExistingShippingAddresses(newShippingAddresses)
            setExistingBillingAddresses(newBillingAddresses)

        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType.current = ACTION_TYPE_ENUM.ADDRESSES
                setReTry(true)
                return
            }
            console.log(error.message)
        }
    })

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [widthPage, heightPage, logged])
    useEffect(() => {
        if(cartReady){
            if(cart.size === 0){
                console.log("ERROR 1")
                router.push("/cart")
            }else{
                getUserCart({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    }
                })
            }
        }
    }, [cartReady])
    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            if(actionType.current === ACTION_TYPE_ENUM.CART){
                getUserCart({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    }
                })
            }else if(actionType.current === ACTION_TYPE_ENUM.ADDRESSES){
                getAddresses({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    }
                })
            }
            actionType.current = ACTION_TYPE_ENUM.NO_ACTION
        }
    }, [accessToken, reTry])
    useEffect(() => {
        if(renderFetchAddresses){
            getAddresses({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [renderFetchAddresses])
    useEffect(() => {
        if(renderCheckout) moveNext(2,3)
    }, [renderCheckout])

    if(loading || cart.size === 0) {
        return <PageLoader display={true}/>
    }
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    return (
        <main ref={fullPageRef} className="overflow-x-hidden overflow-y-clip p-4 flex flex-row items-center justify-center">
            <ShippingAddressList
                selectedShippingAddress={selectedShippingAddress}
                setSelectedShippingAddress={setSelectedShippingAddress}
                existingAddresses={existingShippingAddresses}
                setRenderFetchAddresses={setRenderFetchAddresses}
                ref={shippingSectionRef}
                moveNext={moveNext}
            />
            {
                selectedShippingAddress !== null &&
                <BillingAddressList
                    shippingAddress={selectedShippingAddress}

                    selectedBillingAddress={selectedBillingAddress}
                    setSelectedBillingAddress={setSelectedBillingAddress}

                    existingAddresses={existingBillingAddresses}
                    setRenderFetchAddresses={setRenderFetchAddresses}
                    ref={billingSectionRef}
                    moveBack={moveBack}
                    moveNext={moveNext}
                />
            }
            <DeliveryInfo
                ref={deliveryInfoSectionRef}
                moveBack={moveBack} moveNext={moveNext}
                phoneNumber={{
                    value: phoneNumber,
                    set: setPhoneNumber
                }}
                deliveryInfo={{
                    value: deliveryInfo,
                    set: setDeliveryInfo
                }}
                setRenderCheckout={setRenderCheckout}
            />
            {(selectedShippingAddress && selectedBillingAddress && renderCheckout) &&
                <FinalIndex
                    ref={finalSectionRef}
                    moveBack={moveBack}
                    billingAddress={selectedBillingAddress}
                    shippingAddress={selectedShippingAddress}
                    phoneNumber={phoneNumber}
                />
            }
        </main>
    );
};

export default Checkout;