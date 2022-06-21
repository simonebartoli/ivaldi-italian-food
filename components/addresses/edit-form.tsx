import React, {ChangeEvent, useState} from 'react';
import {NextPage} from "next";

type Props = {
    currentFirstAddress: string
    currentSecondAddress: string
    currentPostcode: string
    currentCity: string
}

const EditForm: NextPage<Props> = ({currentFirstAddress, currentSecondAddress, currentPostcode, currentCity}) => {
    const [firstAddress, setFirstAddress] = useState(currentFirstAddress)
    const [secondAddress, setSecondAddress] = useState(currentSecondAddress)
    const [postcode, setPostcode] = useState(currentPostcode)
    const [city, setCity] = useState(currentCity)

    const [errors, setErrors] = useState({
        firstAddress: "",
        secondAddress: "",
        postcode: "",
        city: ""
    })

    const handleFirstAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setFirstAddress(newValue)
        if(/\d/.test(newValue)){
            setErrors({
                ...errors,
                firstAddress: ""
            })
        }else {
            setErrors({
                ...errors,
                firstAddress: "Address Needs to Contain a Number"
            })
        }
    }
    const handleSecondAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSecondAddress(newValue)
        if(/\d/.test(newValue)){
            setErrors({
                ...errors,
                secondAddress: ""
            })
        }else {
            setErrors({
                ...errors,
                secondAddress: "Address Needs to Contain a Number"
            })
        }
    }
    const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setPostcode(newValue)
    }
    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setCity(newValue)
    }

    return (
        <div className="p-8 bg-white rounded-lg w-full items-start justify-center flex flex-col gap-8">
            <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                <div className="w-3/5 flex flex-row justify-between items-center">
                    <span>Street Address: <span className="text-red-600">*</span></span>
                    <span className="text-red-600 italic text-base">{errors.firstAddress}</span>
                </div>
                <input value={firstAddress} onChange={(e) => handleFirstAddressChange(e)} placeholder="Insert your street address here..." type="text" className="w-3/5 p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
            </div>
            <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                <div className="w-3/5 flex flex-row justify-between items-center">
                    <span>House Name and Flat Number: </span>
                    <span className="text-red-600 italic text-base">{errors.secondAddress}</span>
                </div>
                <input value={secondAddress} onChange={(e) => handleSecondAddressChange(e)} placeholder="Insert your house name and number here..." type="text" className="w-3/5 p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
            </div>
            <div className="flex flex-row w-3/5 gap-8">
                <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                    <div className="w-full flex flex-row justify-between items-center">
                        <span>Postcode: <span className="text-red-600">*</span></span>
                        <span className="text-red-600 italic text-base">{errors.postcode}</span>
                    </div>
                    <input value={postcode} onChange={(e) => handlePostcodeChange(e)} placeholder="Insert your postcode here..." type="text" className="w-full p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
                </div>
                <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                    <div className="w-full flex flex-row justify-between items-center">
                        <span>City: <span className="text-red-600">*</span></span>
                        <span className="text-red-600 italic text-base">{errors.city}</span>
                    </div>
                    <input value={city} onChange={(e) => handleCityChange(e)} placeholder="Insert your city here..." type="text" className="w-full p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
                </div>
            </div>
        </div>
    );
};

export default EditForm;