import {NextPage} from "next";
import React, {useEffect, useState} from "react";
import EditForm from "./edit-form";
import {Bars} from "react-loader-spinner";
import {AiFillSave} from "react-icons/ai";
import {Address} from "./add-address";
import CSS from "csstype";


type Props = {
    billing: boolean
    address: Address
    manualInsert: boolean
    setManualInsert: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    handleSaveAddressButtonClick: () => void
    style?: {
        mainDiv?: CSS.Properties
        insertManualAddressButton?: CSS.Properties
    }
}

const ManualSearchAddress: NextPage<Props> =
    ({
         billing,
         address,
         manualInsert,
         setManualInsert,
         loading,
         handleSaveAddressButtonClick,
        style
    }) => {

    const [buttonClicked, setButtonClicked] = useState(false)
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        address.setCountry("United Kingdom")
    }, [])

    const handleShowAddressFormButtonClick = () => {
        setButtonClicked(true)
        setManualInsert(true)
    }

    return (
        <div className="flex flex-col gap-4 w-full items-center justify-center">
            <span className="text-lg text-center">Don&apos;t you find your address... Insert it here manually</span>
            <button style={style?.insertManualAddressButton} onClick={handleShowAddressFormButtonClick}
                    className="mt-4 flex flex-row justify-center gap-4 items-center lg:w-2/3 w-full p-4 bg-neutral-400 hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">Insert
                you address manually
            </button>
            {
                (buttonClicked && manualInsert) &&
                <div style={style?.mainDiv} className="mt-10 lg:w-2/3 w-full flex flex-col items-center justify-center gap-8">
                    <EditForm
                        currentAddress={{
                            firstAddress: "",
                            secondAddress: "",
                            postcode: "",
                            city: "",
                            country: "United Kingdom",
                            notes: ""
                        }}
                        address={{
                            firstAddress: address.firstAddress,
                            secondAddress: address.secondAddress,
                            postcode: address.postcode,
                            city: address.city,
                            country: address.country,
                            notes: address.notes,
                            setFirstAddress: address.setFirstAddress,
                            setSecondAddress: address.setSecondAddress,
                            setPostcode: address.setPostcode,
                            setCity: address.setCity,
                            setCountry: address.setCountry,
                            setNotes: address.setNotes
                        }}
                        setDisabled={setDisabled}
                        needsDifferent={false}
                        billing={billing}
                        style={{
                            mainPadding: "p-0",
                            width: "w-full"
                        }}
                    />
                    <div className="w-full flex flex-row gap-8 items-center">
                        <button onClick={handleSaveAddressButtonClick} disabled={disabled || loading}
                                className=" disabled:cursor-not-allowed disabled:bg-neutral-500 flex flex-row justify-center gap-4 items-center w-full p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                            {
                                loading ? <Bars height={24} color={"white"}/>
                                    : <>Save <AiFillSave className="text-2xl"/></>
                            }
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ManualSearchAddress