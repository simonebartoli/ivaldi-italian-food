import React, {ChangeEvent, useEffect, useState} from 'react';
import {OpenStreetMapAPIType} from "./openstreet-api-types";
import EditForm from "./edit-form";
import {AiFillSave} from "react-icons/ai";
import {NextPage} from "next";

type Props = {
    extraUK?: boolean
}

const AddAddress: NextPage<Props> = ({extraUK = false}) => {
    const [addAddressVisible, setAddAddressVisible] = useState(false)

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
                            <AutomaticSearchAddress extraUK={extraUK}/>
                            <span className="border-t-[1px] border-dashed border-neutral-500 w-full"/>
                            <ManualSearchAddress extraUK={extraUK}/>
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

type PropsSearch = {
    extraUK: boolean
}

const ManualSearchAddress: NextPage<PropsSearch> = ({extraUK}) => {
    const [buttonClicked, setButtonClicked] = useState(false)
    const [disabled, setDisabled] = useState(true)

    return (
        <div className="flex flex-col gap-4 w-full items-center justify-center">
            <span className="text-lg text-center">Don&apos;t you find your address... Insert it here manually</span>
            <button onClick={() => setButtonClicked(true)} className="mt-4 flex flex-row justify-center gap-4 items-center lg:w-2/3 w-full p-4 bg-neutral-400 hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">Insert you address manually</button>
            {
                buttonClicked &&
                <div className="mt-10 lg:w-2/3 w-full flex flex-col items-center justify-center gap-8">
                    <EditForm currentFirstAddress={""}
                              currentSecondAddress={""}
                              currentPostcode={""}
                              currentCity={""}
                              currentNotes={""}
                              currentCountry={extraUK ? "United Kingdom" : undefined}
                              setDisabled={setDisabled}
                              needsDifferent={false}
                              extraUK={extraUK}
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
    )
}

const AutomaticSearchAddress: NextPage<PropsSearch> = ({extraUK}) => {
    const [searchValue, setSearchValue] = useState("")
    const [wait, setWait] = useState(false)
    const [makeRequest, setMakeRequest] = useState(false)

    const [openStreetFetchResult, setOpenStreetFetchResult] = useState<OpenStreetMapAPIType[]>([])
    const [firstAddress, setFirstAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [postcode, setPostcode] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("Spain")
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
                name: "accept-language",
                value: "en-GB"
            },
            {
                name: "countrycodes",
                value: "gb"
            }
        ]
        let fetchURL = "https://nominatim.openstreetmap.org/search?"
        for(const object of variables){
            if(extraUK){
                if(object.name !== "countrycodes"){
                    fetchURL += `${object.name}=${object.value}&`
                }
            }else{
                fetchURL += `${object.name}=${object.value}&`
            }
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
        setCountry(element.address.country === undefined ? "" : element.address.country)
    }

    return (
        <div className="lg:w-2/3 w-full flex flex-col gap-4 w-full items-center justify-center">
            <span className="text-lg w-full text-center text-center">Search your address automatically</span>
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
                                {extraUK && ", "}
                                {(element.address.country !== undefined && extraUK) && element.address.country}
                            </span>
                        )
                    }
                </div>
                {
                    addressSelected &&
                    <div className="mt-10 w-full flex flex-col items-center justify-center gap-8">
                        <EditForm currentFirstAddress={firstAddress}
                                  currentSecondAddress={secondAddress}
                                  currentPostcode={postcode}
                                  currentCity={city}
                                  currentCountry={extraUK ? country : undefined}
                                  currentNotes={""}
                                  setDisabled={setDisabled}
                                  needsDifferent={false}
                                  extraUK={extraUK}
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