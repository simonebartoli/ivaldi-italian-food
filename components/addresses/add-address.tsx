import React, {useEffect, useState} from 'react';
import {NextPage} from "next";
import ManualSearchAddress from "./manual-search-address";
import AutomaticSearchAddress from "./automatic-search-address";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {useAuth} from "../../contexts/auth-context";
import 'react-toastify/dist/ReactToastify.css';

type AddNewAddressType = {
    data: {
        first_address: string
        second_address?: string
        postcode: string
        city: string
        country: string
        notes?: string
        type: "BILLING" | "SHIPPING"
    }
}
const ADD_NEW_ADDRESS = gql`
    mutation ADD_NEW_ADDRESS($data: AddAddressInput!) {
        addNewAddress(data: $data)
    }
`

type Props = {
    billing: boolean
    setRenderFetchAddresses: React.Dispatch<React.SetStateAction<boolean>>
}
export type Address = {
    firstAddress: string
    setFirstAddress: React.Dispatch<React.SetStateAction<string>>

    secondAddress: string
    setSecondAddress: React.Dispatch<React.SetStateAction<string>>

    postcode: string
    setPostcode: React.Dispatch<React.SetStateAction<string>>

    city: string
    setCity: React.Dispatch<React.SetStateAction<string>>

    country: string
    setCountry: React.Dispatch<React.SetStateAction<string>>

    notes: string
    setNotes: React.Dispatch<React.SetStateAction<string>>
}


const AddAddress: NextPage<Props> = ({billing, setRenderFetchAddresses}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [addNewAddress] = useMutation<true, AddNewAddressType>(ADD_NEW_ADDRESS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoading(false)
            toast.success("Address Added Correctly.")
            setAddAddressVisible(false)
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

    const [addAddressVisible, setAddAddressVisible] = useState(false)
    const [firstAddress, setFirstAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [postcode, setPostcode] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [notes, setNotes] = useState("")

    const [loading, setLoading] = useState(false)
    const [manualInsert, setManualInsert] = useState(false)

    const handleSaveAddressButtonClick = () => {
        setLoading(true)
        addNewAddress({
            variables: {
                data: {
                    first_address: firstAddress.trim(),
                    second_address: secondAddress === "" ? undefined : secondAddress.trim(),
                    postcode: postcode.trim(),
                    city: city.trim(),
                    country: country.trim(),
                    notes: notes,
                    type: billing ? "BILLING" : "SHIPPING"
                }
            }
        })
    }


    useEffect(() => {
        setFirstAddress("")
        setSecondAddress("")
        setPostcode("")
        setCity("")
        setCountry("")
        setNotes("")
    }, [addAddressVisible, manualInsert])

    useEffect(() => {
        if(accessToken !== null && reTry) {
            handleSaveAddressButtonClick()
            setReTry(false)
        }
    }, [accessToken, reTry])

    return (
        <div className="flex flex-col items-end justify-center gap-12 w-full">

            {
                addAddressVisible ?
                    <>
                        <div className="p-8 w-full flex justify-end">
                            <button onClick={() => setAddAddressVisible(false)} className="flex flex-row justify-center gap-4 items-center lg:w-1/3 md:w-1/2 w-full p-4 bg-red-600 hover:bg-red-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                                Cancel
                            </button>
                        </div>
                        <div className="md:p-16 p-8 border-green-standard border-[1px] border-none smxl:border-dashed rounded-lg w-full flex flex-col gap-10 items-center justify-center">
                            <AutomaticSearchAddress
                                address={{
                                    firstAddress: firstAddress,
                                    secondAddress: secondAddress,
                                    postcode: postcode,
                                    city: city,
                                    country: country,
                                    notes: notes,
                                    setFirstAddress: setFirstAddress,
                                    setSecondAddress: setSecondAddress,
                                    setPostcode: setPostcode,
                                    setCity: setCity,
                                    setCountry: setCountry,
                                    setNotes: setNotes
                                }}
                                billing={billing}
                                manualInsert={manualInsert}
                                setManualInsert={setManualInsert}
                                loading={loading}
                                handleSaveAddressButtonClick={handleSaveAddressButtonClick}
                            />
                            <span className="border-t-[1px] border-dashed border-neutral-500 w-full"/>
                            <ManualSearchAddress
                                address={{
                                    firstAddress: firstAddress,
                                    secondAddress: secondAddress,
                                    postcode: postcode,
                                    city: city,
                                    country: country,
                                    notes: notes,
                                    setFirstAddress: setFirstAddress,
                                    setSecondAddress: setSecondAddress,
                                    setPostcode: setPostcode,
                                    setCity: setCity,
                                    setCountry: setCountry,
                                    setNotes: setNotes
                                }}
                                billing={billing}
                                manualInsert={manualInsert}
                                setManualInsert={setManualInsert}
                                loading={loading}
                                handleSaveAddressButtonClick={handleSaveAddressButtonClick}
                            />
                        </div>
                    </> :
                    <div className="p-8 w-full flex justify-end">
                        <button onClick={() => setAddAddressVisible(true)} className="flex flex-row justify-center gap-4 items-center lg:w-1/3 md:w-1/2 w-full p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                            Add Address
                        </button>
                    </div>
            }
        </div>
    );
};



export default AddAddress;