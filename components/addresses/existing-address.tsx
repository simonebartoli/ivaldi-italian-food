import React, {useState} from 'react';
import EditForm from "./edit-form";
import {AiFillSave} from "react-icons/ai";
import {ImBin2, ImCross} from "react-icons/im";
import {BsFillGearFill} from "react-icons/bs";
import {useResizer} from "../../contexts/resizer-context";
import dynamic from "next/dynamic";
import {NextPage} from "next";
const Map = dynamic(() => import("./display-map"), { ssr: false });

type Props = {
    address: {
        address_id: string
        first_address: string
        second_address: string | null
        postcode: string
        city: string
        country: string
        notes: string | null
    }
    extraUK?: boolean
}

const ExistingAddress: NextPage<Props> = (
    {
        extraUK = false,
        address
    }) => {

    const {address_id, first_address, second_address, postcode, city, country, notes} = address

    const {widthPage} = useResizer()
    const [disabled, setDisabled] = useState(true)
    const [displayEdit, setDisplayEdit] = useState(false)

    return (
        <div className="flex flex-col p-8 justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md gap-12">
            <Map latitude={51.51887790000001} longitude={-0.017336947275403046}/>
            <div className="w-full flex flex-col items-start justify-center gap-8">
                {
                    displayEdit ?
                        <>
                            {/*FIX EDIT FORM + UPDATE STATE*/}
                            <EditForm currentFirstAddress={first_address}
                                      currentSecondAddress={second_address === null ? second_address : ""}
                                      currentPostcode={postcode}
                                      currentCity={city}
                                      currentCountry={extraUK ? country : undefined}
                                      currentNotes={notes === null ? notes : ""}
                                      setDisabled={setDisabled}
                                      extraUK={extraUK}
                                      style={{
                                          width: widthPage < 1024 ? "w-full" : undefined,
                                          mainPadding: widthPage < 1024 ? "p-0" : undefined,
                                          bgColor: widthPage < 1024 ? "bg-none" : undefined
                                      }}
                            />
                            <div className="w-full flex smxl:flex-row flex-col smxl:gap-8 gap-4 items-center">
                                <button disabled={disabled} className=" disabled:cursor-not-allowed disabled:bg-neutral-500 flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                                    Save
                                    <AiFillSave className="text-2xl"/>
                                </button>
                                <button onClick={() => setDisplayEdit(false)}  className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                    Cancel
                                    <ImCross className="text-2xl"/>
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <span className="text-xl">{first_address}, {second_address}, {postcode}, {city}, UK</span>
                            <div className="w-full flex smxl:flex-row flex-col smxl:gap-8 gap-4 items-center">
                                <button onClick={() => setDisplayEdit(true)} className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-neutral-500 hover:bg-neutral-400 transition text-white text-xl shadow-lg rounded-lg text-center">
                                    Edit
                                    <BsFillGearFill className="text-2xl"/>
                                </button>
                                <button className="flex flex-row justify-center gap-4 items-center lg:w-1/4 smxl:w-1/2 w-full p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                    Delete
                                    <ImBin2 className="text-2xl"/>
                                </button>
                            </div>
                        </>
                }
            </div>
        </div>
    )
};

export default ExistingAddress;