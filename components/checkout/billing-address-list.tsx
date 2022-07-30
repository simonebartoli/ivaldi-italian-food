import React, {forwardRef, useEffect, useRef, useState} from 'react';
import Address from "./address";
import AddAddress from "../addresses/add-address";
import {AddressReactType} from "../../pages/checkout";
import CSS from "csstype";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {useAuth} from "../../contexts/auth-context";
import _ from "lodash";
import {Bars} from "react-loader-spinner";

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void

    existingAddresses: AddressReactType[]
    setRenderFetchAddresses: React.Dispatch<React.SetStateAction<boolean>>

    shippingAddress: AddressReactType
    selectedBillingAddress: AddressReactType | null
    setSelectedBillingAddress: React.Dispatch<React.SetStateAction<AddressReactType | null>>
}

type StyleType = {[any: string]: CSS.Properties}
const style: StyleType = {
    buttonStyle: {
        width: "100%"
    },
    buttonDivStyle: {
        padding: "0"
    },
    mainDiv: {
        width: "100%"
    },
    insertManualAddressButton: {
        width: "100%"
    }
}


enum AddressTypeEnum {
    BILLING = "BILLING",
    SHIPPING = "SHIPPING"
}
type AddNewAddressType = {
    data: {
        first_address: string
        second_address?: string
        postcode: string
        city: string
        country: string
        notes?: string
        type: AddressTypeEnum
    }
}
const ADD_NEW_ADDRESS = gql`
    mutation ADD_NEW_ADDRESS($data: AddAddressInput!) {
        addNewAddress(data: $data)
    }
`


const BillingAddressList = forwardRef<HTMLDivElement, Props>(({
      moveBack,
      moveNext,
      existingAddresses, // BILLING ADDRESSES
      setRenderFetchAddresses,
      shippingAddress, // SELECTED SHIPPING ADDRESS

      selectedBillingAddress,
      setSelectedBillingAddress

     }, ref) => {

    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [sameAsShipping, setSameAsShipping] = useState(false)
    const [reTry, setReTry] = useState(false)
    const [loading, setLoading] = useState(false)

    const sameAsShippingRef = useRef<HTMLInputElement>(null)

    const handleSameAsShippingInputClick = () => {
        setSelectedBillingAddress(null)
        setSameAsShipping(!sameAsShipping)
    }

    const checkIfSame = (address: AddressReactType, addressToCheck: AddressReactType): boolean => {
        const newAddress = {...address, address_id: undefined, __typename: undefined}
        const newAddressToCheck = {...addressToCheck, address_id: undefined, __typename: undefined}
        return _.isEqual(newAddress, newAddressToCheck);
    }

    const handleNextButtonClick = () => {
        if(sameAsShipping){
            let EQUAL_ADDRESS: AddressReactType | undefined = undefined

            for(const address of existingAddresses){
                if(checkIfSame(address, shippingAddress)) {
                    EQUAL_ADDRESS = address
                    break
                }
            }
            if(EQUAL_ADDRESS !== undefined){
                setSelectedBillingAddress(EQUAL_ADDRESS)
                moveNext(1, 2)
            }else{
                addNewAddress({
                    variables: {
                        data: {
                            first_address: shippingAddress.first_address,
                            second_address: shippingAddress.second_address !== null ? shippingAddress.second_address : undefined,
                            postcode: shippingAddress.postcode,
                            city: shippingAddress.city,
                            notes: shippingAddress.notes !== null ? shippingAddress.notes : undefined,
                            country: "United Kingdom",
                            type: AddressTypeEnum.BILLING
                        }
                    }
                })
            }
            setSameAsShipping(false)
        }else{
            moveNext(1, 2)
        }
    }



    const [addNewAddress] = useMutation<{addNewAddress: number}, AddNewAddressType>(ADD_NEW_ADDRESS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: (data) => {
            setLoading(false)
            console.log("SUCCESS")
            moveNext(1,2)
            setSelectedBillingAddress({
                ...shippingAddress,
                address_id: data.addNewAddress
            })
            setRenderFetchAddresses(true)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            console.log(error.message)
            setReTry(false)
            setLoading(false)
            toast.error("Sorry, there is a problem. Try Again.")
        }
    })

    useEffect(() => {
        if(selectedBillingAddress !== null) {
            setSameAsShipping(false)
        }
    }, [setSelectedBillingAddress])

    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            addNewAddress({
                variables: {
                    data: {
                        first_address: shippingAddress.first_address,
                        second_address: shippingAddress.second_address !== null ? shippingAddress.second_address : undefined,
                        postcode: shippingAddress.postcode,
                        city: shippingAddress.city,
                        notes: shippingAddress.notes !== null ? shippingAddress.notes : undefined,
                        country: "United Kingdom",
                        type: AddressTypeEnum.BILLING
                    }
                }
            })
        }
    }, [accessToken, reTry])

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center w-1/2 gap-8 py-8">
            <h2 className="text-3xl mb-8">Select your Billing Address</h2>
            <div className="flex flex-row gap-8">
                <input ref={sameAsShippingRef} onChange={handleSameAsShippingInputClick} checked={sameAsShipping} type="checkbox" className="scale-125"/>
                <span className="text-xl">Same as Shipping Address</span>
            </div>

            {
                existingAddresses.length === 0 ?
                    <div className="w-full flex items-center p-10 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>
                :
                existingAddresses.map((element) =>
                    <Address
                        key={element.address_id}
                        address={element}
                        addressSelected={selectedBillingAddress}
                        setAddressSelected={setSelectedBillingAddress}
                    />
                )
            }
            <AddAddress
                billing={true}
                setRenderFetchAddresses={setRenderFetchAddresses}
                style={style}
            />
            <div className="mt-8 flex flex-row w-full justify-between items-center gap-8">
                <button onClick={() => moveBack(1, 0)} className="hover:bg-red-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-red-600">Back</button>
                <button onClick={handleNextButtonClick} disabled={(selectedBillingAddress === null && !sameAsShipping) || loading} className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 flex items-center justify-center transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-green-standard">
                    {
                        loading ? <Bars height={24} color={"white"}/>
                            : <>Next</>
                    }
                </button>
            </div>
        </section>
    );
});

BillingAddressList.displayName = "BillingAddressList"
export default React.memo(BillingAddressList);