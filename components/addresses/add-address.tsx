import React, {ChangeEvent, useEffect, useState} from 'react';
import {OpenStreetMapAPIType} from "./openstreet-api-types";
import EditForm from "./edit-form";
import {AiFillSave} from "react-icons/ai";

const AddAddress = () => {
    const [addAddressVisible, setAddAddressVisible] = useState(false)

    return (
        <div className="flex flex-col items-end justify-center gap-12 w-full">

            {
                addAddressVisible ?
                    <>
                        <button onClick={() => setAddAddressVisible(false)} className="flex flex-row justify-center gap-4 items-center w-1/3 p-4 bg-red-600 hover:bg-red-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                            Cancel
                        </button>
                        <div className="p-16 border-green-standard border-[1px] border-dashed rounded-lg w-full flex flex-col gap-10 items-center justify-center">
                            <AutomaticSearchAddress/>
                            <span className="border-t-[1px] border-dashed border-neutral-500 w-full"/>
                            <div className="flex flex-col gap-4 w-full items-center justify-center">
                                <span className="text-lg">Don&apos;t you find your address... Insert it here manually</span>
                                <button className="flex flex-row justify-center gap-4 items-center w-1/3 p-4 bg-neutral-400 hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">Insert you address manually</button>
                            </div>
                        </div>
                    </> :
                    <button onClick={() => setAddAddressVisible(true)} className="flex flex-row justify-center gap-4 items-center w-1/3 p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                        Add Address
                    </button>
            }
        </div>
    );
};

const AutomaticSearchAddress = () => {
    const [searchValue, setSearchValue] = useState("")
    const [wait, setWait] = useState(false)
    const [makeRequest, setMakeRequest] = useState(false)

    const [openStreetFetchResult, setOpenStreetFetchResult] = useState<OpenStreetMapAPIType[]>([])
    const [firstAddress, setFirstAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [postcode, setPostcode] = useState("")
    const [city, setCity] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [addressSelected, setAddressSelected] = useState(false)

    useEffect(() => {
        if(wait){
            setTimeout(() => {
                setWait(false)
            }, 2000)
        }else{
            if(makeRequest){
                fetchOpenStreetMapAPI(searchValue)
                setMakeRequest(false)
            }
        }
    }, [wait, makeRequest])

    const fetchOpenStreetMapAPI = async (query: string) => {
        const requestOptions: RequestInit = {
            method: 'GET',
            mode: "cors",
            redirect: 'follow'
        };
        const variables = [
            {
                name: "q",
                value: query
            },
            {
                name: "format",
                value: "json"
            },
            {
                name: "addressdetails",
                value: "1"
            },
            {
                name: "countrycodes",
                value: "gb"
            }
        ]
        let fetchURL = "https://nominatim.openstreetmap.org/search?"
        for(const object of variables){
            fetchURL += `${object.name}=${object.value}&`
        }
        const result = await fetch(fetchURL, requestOptions)
        const resultJSON = await result.json()
        setOpenStreetFetchResult(resultJSON)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressSelected(false)
        const newValue = e.target.value
        setSearchValue(newValue)
        if(newValue.length > 3){
            if(!wait){
                fetchOpenStreetMapAPI(newValue)
                setWait(true)
            }else{
                setMakeRequest(true)
            }
        }else{
            setOpenStreetFetchResult([])
        }
    }

    const onAutoCompleteClick = (element: OpenStreetMapAPIType) => {
        setOpenStreetFetchResult([])
        setSearchValue("")
        setAddressSelected(true)
        setFirstAddress(`${element.address.house_number === undefined ? "" : element.address.house_number} ${element.address.road === undefined ? "" : element.address.road}`)
        setSecondAddress(element.address.building === undefined ? "" : element.address.building)
        setCity(element.address.city === undefined ? "" : element.address.city)
        setPostcode(element.address.postcode === undefined ? "" : element.address.postcode)
    }

    return (
        <div className="w-1/2 flex flex-col gap-4 w-full items-center justify-center">
            <span className="text-lg w-full text-center">Search your address automatically</span>
            <div className="w-full flex flex-col gap-4 items-center justify-center">
                <input onChange={(e) => handleInputChange(e)} value={searchValue} type="text" placeholder="Insert your address here..." className="w-full p-3 text-lg rounded-lg border-[2px] border-green-standard shadow-md"/>
                <div className="w-full flex flex-col gap-0 items-start justify-center">
                    {
                        openStreetFetchResult.map((element, index) =>
                            <span onClick={() => onAutoCompleteClick(element)} key={index} className="cursor-pointer transition p-4 bg-neutral-200 w-full hover:bg-neutral-100">
                                {element.address.house_number} {element.address.road !== undefined && element.address.road + ", "}
                                {element.address.building !== undefined && element.address.building + ", "}
                                {element.address.postcode !== undefined && element.address.postcode + ", "}
                                {element.address.city !== undefined && element.address.city}
                            </span>
                        )
                    }
                </div>
                {
                    addressSelected &&
                    <div className="mt-10 flex flex-col items-center justify-center gap-8">
                        <EditForm currentFirstAddress={firstAddress}
                                  currentSecondAddress={secondAddress}
                                  currentPostcode={postcode}
                                  currentCity={city}
                                  currentNotes={""}
                                  setDisabled={setDisabled}
                                  needsDifferent={false}
                                  style={{
                                      mainPadding: "p-0",
                                      width: "w-full"
                                  }}
                        />
                        <div className="w-full flex flex-row gap-8 items-center">
                            <button disabled={disabled} className=" disabled:cursor-not-allowed disabled:bg-neutral-500 flex flex-row justify-center gap-4 items-center w-full p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                                Save
                                <AiFillSave className="text-2xl"/>
                            </button>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default AddAddress;