import {NextPage} from "next";
import React, {ChangeEvent, useEffect, useState} from "react";
import {OpenStreetMapAPIType} from "./openstreet-api-types";
import EditForm from "./edit-form";
import {AiFillSave} from "react-icons/ai";
import {Address} from "./add-address";
import CSS from 'csstype';


type Props = {
    billing: boolean
    address: Address
    manualInsert: boolean
    setManualInsert: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    handleSaveAddressButtonClick: () => void

    style?: {
        mainDiv?: CSS.Properties
    }
}

const AutomaticSearchAddress: NextPage<Props> =
    ({
         billing,
         address,
         manualInsert,
         setManualInsert,
         loading,
         handleSaveAddressButtonClick,
        style
    }) => {

    const [searchValue, setSearchValue] = useState("")
    const [wait, setWait] = useState(false)
    const [makeRequest, setMakeRequest] = useState(false)

    const [openStreetFetchResult, setOpenStreetFetchResult] = useState<OpenStreetMapAPIType[]>([])

    const [disabled, setDisabled] = useState(false)
    const [addressSelected, setAddressSelected] = useState(false)

    useEffect(() => {
        if (wait) {
            setTimeout(() => {
                setWait(false)
            }, 2000)
        } else {
            if (makeRequest) {
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
        for (const object of variables) {
            if (billing) {
                if (object.name !== "countrycodes") {
                    fetchURL += `${object.name}=${object.value}&`
                }
            } else {
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
        if (newValue.length > 3) {
            if (!wait) {
                fetchOpenStreetMapAPI(newValue)
                setWait(true)
            } else {
                setMakeRequest(true)
            }
        } else {
            setOpenStreetFetchResult([])
        }
    }

    const onAutoCompleteClick = (element: OpenStreetMapAPIType) => {
        setOpenStreetFetchResult([])
        setSearchValue("")
        setAddressSelected(true)
        setManualInsert(false)

        address.setFirstAddress(`${element.address.house_number === undefined ? "" : element.address.house_number} ${element.address.road === undefined ? "" : element.address.road}`)
        address.setSecondAddress(element.address.building === undefined ? "" : element.address.building)
        address.setCity(element.address.city === undefined ? "" : element.address.city)
        address.setPostcode(element.address.postcode === undefined ? "" : element.address.postcode)
        address.setCountry(element.address.country === undefined ? "" : element.address.country)
    }

    return (
        <div style={style?.mainDiv} className="lg:w-2/3 w-full flex flex-col gap-4 w-full items-center justify-center">
            <span className="text-lg w-full text-center text-center">Search your address automatically</span>
            <div className="w-full flex flex-col gap-4 items-center justify-center">
                <input onChange={(e) => handleInputChange(e)} value={searchValue} type="text"
                       placeholder="Insert your address here..."
                       className="w-full p-3 text-lg rounded-lg border-[2px] border-green-standard shadow-md"/>
                <div className="w-full flex flex-col gap-0 items-start justify-center">
                    {
                        openStreetFetchResult.map((element, index) =>
                            <span onClick={() => onAutoCompleteClick(element)} key={index}
                                  className="cursor-pointer transition p-4 bg-neutral-200 w-full hover:bg-neutral-100">
                                {element.address.house_number} {element.address.road !== undefined && element.address.road + ", "}
                                {element.address.building !== undefined && element.address.building + ", "}
                                {element.address.postcode !== undefined && element.address.postcode + ", "}
                                {element.address.city !== undefined && element.address.city}
                                {billing && ", "}
                                {(element.address.country !== undefined && billing) && element.address.country}
                            </span>
                        )
                    }
                </div>
                {
                    (addressSelected && !manualInsert) &&
                    <div className="mt-10 w-full flex flex-col items-center justify-center gap-8">
                        <EditForm
                            currentAddress={{
                                firstAddress: address.firstAddress,
                                secondAddress: address.secondAddress,
                                postcode: address.postcode,
                                city: address.city,
                                country: billing ? address.country : "United Kingdom",
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

export default AutomaticSearchAddress