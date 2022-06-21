import React, {useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import {BsFillGearFill} from "react-icons/bs";
import {ImBin2, ImCross} from "react-icons/im";
import dynamic from "next/dynamic";
import EditForm from "../components/addresses/edit-form";
import {AiFillSave} from "react-icons/ai";
const Map = dynamic(() => import("../components/addresses/display-map"), { ssr: false });

const ShippingAddresses = () => {
    const [firstAddress, setFirstAddress] = useState("1 Yeo Street")
    const [secondAddress, setSecondAddress] = useState("Caspian Wharf 40")
    const [postcode, setPostcode] = useState("E33AE")
    const [city, setCity] = useState("London")

    const [displayEdit, setDisplayEdit] = useState(false)


    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="text-3xl">My Shipping Addresses</h1>
            <div className="flex flex-col p-8 justify-center items-center bg-neutral-50 rounded-lg w-full shadow-md gap-12">
                <Map latitude={51.51887790000001} longitude={-0.017336947275403046}/>
                <div className="w-full flex flex-col items-start justify-center gap-8">
                    {
                        displayEdit ?
                            <>
                                <EditForm currentFirstAddress={firstAddress}
                                          currentSecondAddress={secondAddress}
                                          currentPostcode={postcode}
                                          currentCity={city}
                                />
                                <div className="w-full flex flex-row gap-8 items-center">
                                    <button className="flex flex-row justify-center gap-4 items-center w-1/4 p-4 bg-green-standard hover:bg-green-500 transition text-white text-xl shadow-lg rounded-lg text-center">
                                        Save
                                        <AiFillSave className="text-2xl"/>
                                    </button>
                                    <button onClick={() => setDisplayEdit(false)}  className="flex flex-row justify-center gap-4 items-center w-1/4 p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                        Cancel
                                        <ImCross className="text-2xl"/>
                                    </button>
                                </div>
                            </>
                            :
                            <>
                                <span className="text-xl">{firstAddress}, {secondAddress}, {postcode}, {city}, UK</span>
                                <div className="w-full flex flex-row gap-8 items-center">
                                    <button onClick={() => setDisplayEdit(true)} className="flex flex-row justify-center gap-4 items-center w-1/4 p-4 bg-neutral-500 hover:bg-neutral-400 transition text-white text-xl shadow-lg rounded-lg text-center">
                                        Edit
                                        <BsFillGearFill className="text-2xl"/>
                                    </button>
                                    <button className="flex flex-row justify-center gap-4 items-center w-1/4 p-4 bg-red-600 hover:bg-red-500 transition text-white text-lg shadow-lg rounded-lg text-center">
                                        Delete
                                        <ImBin2 className="text-2xl"/>
                                    </button>
                                </div>
                            </>
                    }
                </div>
            </div>
        </LayoutPrivate>
    );
};

export default ShippingAddresses;