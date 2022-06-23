import React, {ChangeEvent, useEffect, useState} from 'react';
import {NextPage} from "next";
import {countries} from "../../static-data/countries";

type Props = {
    currentFirstAddress: string
    currentSecondAddress: string
    currentPostcode: string
    currentCity: string
    currentCountry?: string
    currentNotes: string
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>
    needsDifferent?: boolean
    extraUK?: boolean
    style?: {
        mainPadding?: string
        width?: string
        bgColor?: string
    }
}

const EditForm: NextPage<Props> = ({   currentFirstAddress,
                                       currentSecondAddress,
                                       currentPostcode,
                                       currentCity,
                                       currentCountry,
                                       currentNotes,
                                       setDisabled,
                                       needsDifferent = true,
                                       extraUK = false,
                                       style}) => {
    const [firstAddress, setFirstAddress] = useState(currentFirstAddress)
    const [secondAddress, setSecondAddress] = useState(currentSecondAddress)
    const [postcode, setPostcode] = useState(currentPostcode)
    const [city, setCity] = useState(currentCity)
    const [country, setCountry] = useState(currentCountry)
    const [notes, setNotes] = useState(currentNotes)

    const [firstAddressError, setFirstAddressError] = useState("")
    const [secondAddressError, setSecondAddressError] = useState("")
    const [postcodeError, setPostcodeError] = useState("")
    const [cityError, setCityError] = useState("")

    useEffect(() => {
        checkFirstAddress(firstAddress)
        checkSecondAddress(secondAddress)
        checkPostcode(postcode)
        checkCity(city)
    }, [])

    const checkErrors = (): boolean => {
        let OK = false
        if( firstAddressError === "" &&
            secondAddressError === "" &&
            postcodeError === "" &&
            cityError === ""){

            if(needsDifferent){
                if(currentFirstAddress !== firstAddress ||
                    currentSecondAddress !== secondAddress ||
                    currentPostcode !== postcode ||
                    currentCity !== city){
                    OK = true
                }
            }else{
                OK = true
            }
        }
        return OK
    }

    useEffect(() => {
        if(checkErrors()){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [firstAddressError, secondAddressError, cityError, postcodeError, firstAddress, secondAddress, postcode, city])

    const handleFirstAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setFirstAddress(newValue)
        checkFirstAddress(newValue)
    }
    const handleSecondAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSecondAddress(newValue)
        checkSecondAddress(newValue)
    }
    const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setPostcode(newValue)
        checkPostcode(newValue)
    }
    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setCity(newValue)
        checkCity(newValue)
    }

    const checkFirstAddress = (newValue: string) => {
        console.log(newValue)
        if(newValue.length > 5){
            if(/\d/.test(newValue)){
                setFirstAddressError("")
            }else {
                setFirstAddressError("Address Needs to Contain a Number")
            }
        }else if(newValue.length === 0){
            setFirstAddressError("Address Required")
        }else{
            setFirstAddressError("Address Not Valid")
        }
    }
    const checkSecondAddress = (newValue: string) => {
        if(newValue.length > 0){
            if(newValue.length > 5){
                if(/\d/.test(newValue)){
                    setSecondAddressError("")
                }else {
                    setSecondAddressError("Flat Number Required")
                }
            }else{
                setSecondAddressError("Address Not Valid")
            }
        }else{
            setSecondAddressError("")
        }
    }
    const checkPostcode = (newValue: string) => {
        if(!extraUK && newValue.length > 3 && newValue.length < 9){
            setPostcodeError("")
        }else if (extraUK && newValue.length > 3 && newValue.length < 20) {
            setPostcodeError("")
        }else if(newValue.length === 0) {
            setPostcodeError("Postcode Required")
        }else{
            setPostcodeError("Postcode Not Valid")
        }
    }
    const checkCity = (newValue: string) => {
        if(newValue.length > 2 && newValue.length < 30){
            setCityError("")
        }else if(newValue.length === 0) {
            setCityError("City Required")
        }else{
            setCityError("City Not Valid")
        }
    }


    return (
        <div className={`${style?.mainPadding !== undefined ? style.mainPadding : "p-8"} ${style?.bgColor !== undefined ? style.bgColor : "bg-white"} rounded-lg w-full items-start justify-center flex flex-col gap-8`}>
            <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                <div className={`${style?.width !== undefined ? style.width : "w-3/5"} flex flex-row justify-between items-center`}>
                    <span>Street Address: <span className="text-red-600">*</span></span>
                    <span className="text-red-600 italic text-base text-right">{firstAddressError}</span>
                </div>
                <input value={firstAddress} onChange={(e) => handleFirstAddressChange(e)} placeholder="Insert your street address here..." type="text" className={`${style?.width !== undefined ? style.width : "w-3/5"} p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md`}/>
            </div>
            <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                <div className={`${style?.width !== undefined ? style.width : "w-3/5"} flex flex-row justify-between items-center`}>
                    <span>House Name and Flat Number: </span>
                    <span className="text-red-600 italic text-base text-right">{secondAddressError}</span>
                </div>
                <input value={secondAddress} onChange={(e) => handleSecondAddressChange(e)} placeholder="Insert your house name and number here..." type="text" className={`${style?.width !== undefined ? style.width : "w-3/5"} p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md`}/>
            </div>
            <div className={`${style?.width !== undefined ? style.width : "w-3/5"} flex mdx:flex-row flex-col gap-8`}>
                <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                    <div className="w-full flex flex-row justify-between items-center">
                        <span>Postcode: <span className="text-red-600">*</span></span>
                        <span className="text-red-600 italic text-base text-right">{postcodeError}</span>
                    </div>
                    <input value={postcode} onChange={(e) => handlePostcodeChange(e)} placeholder="Insert your postcode here..." type="text" className="w-full p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
                </div>
                <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                    <div className="w-full flex flex-row justify-between items-center">
                        <span>City: <span className="text-red-600">*</span></span>
                        <span className="text-red-600 italic text-base text-right">{cityError}</span>
                    </div>
                    <input value={city} onChange={(e) => handleCityChange(e)} placeholder="Insert your city here..." type="text" className="w-full p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md"/>
                </div>
            </div>
            {
                extraUK &&
                <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                    <div className={`${style?.width !== undefined ? style.width : "w-3/5"} flex flex-row justify-between items-center`}>
                        <span>Country: </span>
                    </div>
                    <select defaultValue={country} className={`${style?.width !== undefined ? style.width : "w-3/5"} p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md`}>
                        {
                            countries.map((element, index) =>
                                <option key={index} value={element.name}>{element.name}</option>
                            )
                        }
                    </select>
                </div>
            }
            <div className="w-full flex flex-col gap-2 items-start justify-center text-lg">
                <div className={`${style?.width !== undefined ? style.width : "w-3/5"} flex flex-row justify-between items-center`}>
                    <span>Further Notes: </span>
                </div>
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Insert your notes here..." type="text" className={`${style?.width !== undefined ? style.width : "w-3/5"} p-3 text-lg rounded-lg border-[1px] border-neutral-500 shadow-md`}/>
            </div>
        </div>
    );
};

export default EditForm;