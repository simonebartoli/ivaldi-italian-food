import React, {ChangeEvent, useEffect, useState} from 'react';
import {NextPage} from "next";

type Props = {
    priceMin: {
        value: number
        set: React.Dispatch<React.SetStateAction<number>>
    }
    priceMax: {
        value: number
        set: React.Dispatch<React.SetStateAction<number>>
    }
    setFetchPriceRange: React.Dispatch<React.SetStateAction<boolean>>
    setMinTypedByUser: React.Dispatch<React.SetStateAction<boolean>>
    setMaxTypedByUser: React.Dispatch<React.SetStateAction<boolean>>
}

const PriceRange: NextPage<Props> = ({
                        priceMin,
                        priceMax,
                        setFetchPriceRange,
                        setMinTypedByUser,
                        setMaxTypedByUser
                    }) => {
    const [priceMin_string, setPriceMin_string] = useState(priceMin.value.toFixed(2))
    const [priceMax_string, setPriceMax_string] = useState(priceMax.value.toFixed(2))

    useEffect(() => {
        setPriceMin_string(priceMin.value.toFixed(2))
    }, [priceMin])
    useEffect(() => {
        setPriceMax_string(priceMax.value.toFixed(2))
    }, [priceMax])

    const handlePriceMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) setPriceMin_string(newValue)
    }
    const handlePriceMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) setPriceMax_string(newValue)
    }

    const handleBlurInput = (type: "MIN" | "MAX") => {
        if (type === "MIN") {
            setMinTypedByUser(true)
            setPriceMin_string(Number(priceMin_string).toFixed(2))
            priceMin.set(Number(Number(priceMin_string).toFixed(2)))
        } else if (type === "MAX") {
            setMaxTypedByUser(true)
            setPriceMax_string(Number(priceMax_string).toFixed(2))
            priceMax.set(Number(Number(priceMax_string).toFixed(2)))
        }
        setFetchPriceRange(true)
    }

    return (
        <div
            className="border-b-[1px] border-neutral-300 flex smx:text-xl text-lg w-full flex-col justify-center items-center">
            <div className="p-6 py-3 flex flex-row gap-2 w-full justify-center items-center">
                <span className="w-2/3">Minimum Price:</span>
                <div className="flex flex-row gap-4 items-center justify-start w-1/3">
                    <span className="text-2xl">£</span>
                    <input type="text" onBlur={() => handleBlurInput("MIN")} value={priceMin_string}
                           onChange={(e) => handlePriceMinChange(e)}
                           className="p-3 text-xl w-full"/>
                </div>
            </div>
            <div className="p-6 py-3 flex flex-row gap-2 w-full items-center justify-center">
                <span className="w-2/3">Maximum Price:</span>
                <div className="flex flex-row gap-4 items-center justify-start w-1/3">
                    <span className="text-2xl">£</span>
                    <input type="text" onBlur={() => handleBlurInput("MAX")} value={priceMax_string}
                           onChange={(e) => handlePriceMaxChange(e)}
                           className="p-3 text-xl w-full"/>
                </div>
            </div>
        </div>
    );
};

export default PriceRange;