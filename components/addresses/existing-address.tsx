import React, {useEffect, useState} from 'react';
import EditForm from "./edit-form";
import {AiFillSave} from "react-icons/ai";
import {ImCross} from "react-icons/im";
import {BsFillGearFill} from "react-icons/bs";
import {useResizer} from "../../contexts/resizer-context";
import dynamic from "next/dynamic";
import {NextPage} from "next";
import {Bars} from "react-loader-spinner";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../contexts/auth-context";
import {toast} from "react-toastify";
const Map = dynamic(() => import("./display-map"), { ssr: false });

type Props = {
    currentAddress: {
        address_id: string
        first_address: string
        second_address: string | null
        postcode: string
        city: string
        country: string
        notes: string | null

        coordinates: string | null
    }
    billing: boolean
    setRenderFetchAddresses: React.Dispatch<React.SetStateAction<boolean>>
}
type EditAddressType = {
    data: {
        address_id: number
        first_address?: string
        second_address?: string
        postcode?: string
        city?: string
        country?: string
        notes?: string
    }
}
type RemoveAddressType = {
    data: {
        address_id: number
    }
}
const EDIT_ADDRESS = gql`
    mutation EDIT_ADDRESS($data: EditAddressInput!) {
        editExistingAddress(data: $data)
    }
`

const REMOVE_ADDRESS = gql`
    mutation REMOVE_ADDRESS($data: RemoveAddressInput!) {
        removeAddress(data: $data)
    }
`

const ExistingAddress: NextPage<Props> = (
    {
        billing ,
        currentAddress,
        setRenderFetchAddresses
    }) => {

    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState<"EDIT" | "DELETE" | null>(null)

    const [editAddress] = useMutation<true, EditAddressType>(EDIT_ADDRESS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoadingEdit(false)
            setDisplayEdit(false)
            toast.success("Address Modified Correctly.")
            setRenderFetchAddresses(true)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry("EDIT")
                return
            }
            console.log(error.message)
            setReTry(null)
            setLoadingEdit(false)
            toast.error("Sorry, there is a problem. Try Again.")
        }
    })
    const [removeAddress] = useMutation<true, RemoveAddressType>(REMOVE_ADDRESS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoadingDelete(false)
            setDisplayEdit(false)
            toast.success("Address Removed Correctly.")
            setRenderFetchAddresses(true)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry("DELETE")
                return
            }
            console.log(error.message)
            setReTry(null)
            setLoadingDelete(false)
            toast.error("Sorry, there is a problem. Try Again.")
        }
    })

    const {widthPage} = useResizer()
    const [disabled, setDisabled] = useState(true)
    const [displayEdit, setDisplayEdit] = useState(false)
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const [firstAddress, setFirstAddress] = useState(currentAddress.first_address)
    const [secondAddress, setSecondAddress] = useState(currentAddress.second_address !== null ? currentAddress.second_address : "")
    const [postcode, setPostcode] = useState(currentAddress.postcode)
    const [city, setCity] = useState(currentAddress.city)
    const [country, setCountry] = useState(currentAddress.country)
    const [notes, setNotes] = useState(currentAddress.notes !== null ? currentAddress.notes : "")

    const handleSaveAddressButtonClick = () => {
        setLoadingEdit(true)
        editAddress({
            variables: {
                data: {
                    address_id: Number(currentAddress.address_id),
                    first_address: firstAddress,
                    second_address: secondAddress === "" ? undefined : secondAddress,
                    postcode: postcode,
                    city: city,
                    country: billing ? country : undefined,
                    notes: notes === "" ? undefined : notes
                }
            }
        })
    }

    const handleDeleteAddressButtonClick = () => {
        setLoadingDelete(true)
        setDisabled(true)
        removeAddress({
            variables: {
                data: {
                    address_id: Number(currentAddress.address_id),
                }
            }
        })
    }

    useEffect(() => {
        if(accessToken !== null && reTry !== null) {
            if(reTry === "EDIT") handleSaveAddressButtonClick()
            else if(reTry === "DELETE") handleDeleteAddressButtonClick()

            setReTry(null)
        }
    }, [accessToken, reTry])

    return (
        <div className="flex flex-col p-8 justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md gap-12">
            <Map coordinates={currentAddress.coordinates}/>
            <div className="w-full flex flex-col items-start justify-center gap-8">
                {
                    displayEdit ?
                        <>
                            <EditForm
                                currentAddress={{
                                    firstAddress: currentAddress.first_address,
                                    secondAddress: currentAddress.second_address !== null ? currentAddress.second_address : "",
                                    postcode: currentAddress.postcode,
                                    city: currentAddress.city,
                                    country: currentAddress.country,
                                    notes: currentAddress.notes !== null ? currentAddress.notes : ""
                                }}
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
                                setDisabled={setDisabled}
                                billing={billing}
                                style={{
                                    width: widthPage < 1024 ? "w-full" : undefined,
                                    mainPadding: widthPage < 1024 ? "p-0" : undefined,
                                    bgColor: widthPage < 1024 ? "bg-none" : undefined
                                }}
                            />
                            <div className="w-full flex smxl:flex-row flex-col smxl:gap-8 gap-4 items-center">
                                <button onClick={handleSaveAddressButtonClick} disabled={disabled || loadingEdit} className=" disabled:cursor-not-allowed disabled:bg-neutral-500 flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                                    {
                                        loadingEdit ? <Bars height={24} color={"white"}/>
                                            : <>Save <AiFillSave className="text-2xl"/></>
                                    }
                                </button>
                                <button onClick={() => setDisplayEdit(false)}  className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                    Cancel
                                    <ImCross className="text-2xl"/>
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <span className="text-xl">
                                {currentAddress.first_address !== null ? currentAddress.first_address + ", " : ""}
                                {currentAddress.second_address !== null ? currentAddress.second_address + ", " : ""}
                                {currentAddress.postcode},&nbsp;
                                {currentAddress.city},&nbsp;
                                {currentAddress.country}
                            </span>
                            <div className="w-full flex smxl:flex-row flex-col smxl:gap-8 gap-4 items-center">
                                <button onClick={() => setDisplayEdit(true)} className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-neutral-500 hover:bg-neutral-400 transition text-white text-xl shadow-lg rounded-lg text-center">
                                    Edit
                                    <BsFillGearFill className="text-2xl"/>
                                </button>
                                <button onClick={handleDeleteAddressButtonClick} className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                    {
                                        loadingDelete ? <Bars height={24} color={"white"}/>
                                            : <>Delete <ImCross className="text-2xl"/></>
                                    }
                                </button>
                            </div>
                        </>
                }
            </div>
        </div>
    )
};

export default ExistingAddress;