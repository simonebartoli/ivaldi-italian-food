import React, {ChangeEvent, useState} from 'react';
import {AiOutlineBars} from "react-icons/ai";
import {NextPage} from "next";

type Props = {
    priceMin: {
        value: string
        set: React.Dispatch<React.SetStateAction<string>>
    }
    priceMax: {
        value: string
        set: React.Dispatch<React.SetStateAction<string>>
    }
    dateMin: {
        value: string
        set: React.Dispatch<React.SetStateAction<string>>
    },
    dateMax: {
        value: string
        set: React.Dispatch<React.SetStateAction<string>>
    }
    setApplyFilters: React.Dispatch<React.SetStateAction<boolean>>
    setResetFilters: React.Dispatch<React.SetStateAction<boolean>>
}

const OrdersReceiptsFilters: NextPage<Props> = ({
                                                    priceMin,
                                                    priceMax,
                                                    dateMin,
                                                    dateMax,
                                                    setApplyFilters,
                                                    setResetFilters
                                                }) => {
    const [filterVisible, setFilterVisible] = useState(false)
    const handleFilterVisibleClick = () => {
        setFilterVisible(!filterVisible)
    }

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>, type: "MIN" | "MAX") => {
        const newValue = e.target.value
        if (type === "MIN") dateMin.set(newValue)
        else if (type === "MAX") dateMax.set(newValue)
    }

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>, type: "MIN" | "MAX") => {
        const newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) {
            if (type === "MIN") priceMin.set(newValue)
            else if (type === "MAX") priceMax.set(newValue)
        }
    }

    const handleBlurInput = (type: "MIN" | "MAX") => {
        if (type === "MIN") {
            if (priceMin.value !== "") priceMin.set(Number(priceMin.value).toFixed(2))
        } else if (type === "MAX") {
            if (priceMax.value !== "") priceMax.set(Number(priceMax.value).toFixed(2))
        }
    }

    return (
        <div className="w-full flex flex-col gap-8 smx:items-end items-center justify-center">
            <div onClick={handleFilterVisibleClick}
                 className="hover:bg-neutral-100 transition flex mt-4 flex-row gap-4 items-center justify-center cursor-pointer p-4 bg-neutral-200 rounded-lg text-2xl font-semibold shadow-lg mdx:w-1/3 smxl:w-1/2 smx:w-3/4 w-5/6 text-center ">
                <span>Filters</span>
                <AiOutlineBars className="mt-[3px]"/>
            </div>
            {
                filterVisible ?
                    <div
                        className="border-y-[1px] border-neutral-500 border-dashed smxl:py-8 p-4 my-8 w-full flex flex-col gap-12 items-center justify-center">
                        <div className="w-full flex lg:flex-row lg:gap-2 gap-10 flex-col justify-center items-center">
                            <div className="xls:w-2/5 lg:w-1/2 w-full flex flex-col justify-center items-center  gap-8">
                                <span className="text-xl">Price Range:</span>
                                <div className="flex flex-col gap-4 w-full">
                                    <div
                                        className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-center">
                                        <span>Minimum Price: </span>
                                        <input onBlur={() => handleBlurInput("MIN")} value={priceMin.value}
                                               onChange={(e) => handlePriceChange(e, "MIN")} type="text"
                                               placeholder="Minimum Price..."
                                               className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                                    </div>
                                    <div
                                        className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-center">
                                        <span>Maximum Price: </span>
                                        <input onBlur={() => handleBlurInput("MAX")} value={priceMax.value}
                                               onChange={(e) => handlePriceChange(e, "MAX")} type="text"
                                               placeholder="Maximum Price..."
                                               className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                                    </div>
                                </div>
                            </div>
                            <div className="xls:w-2/5 lg:w-1/2 w-full flex flex-col justify-center items-center gap-8">
                                <span className="text-xl">Date Range:</span>
                                <div className="flex flex-col gap-4 w-full">
                                    <div
                                        className=" flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-center">
                                        <span>Start Date: </span>
                                        <input type="date"
                                               onChange={(e) => handleDateChange(e, "MIN")}
                                               value={dateMin.value}
                                               className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                                    </div>
                                    <div
                                        className="flex smxl:flex-row flex-col smxl:gap-6 gap-2 smxl:items-center items-start justify-center">
                                        <span>End Date:&nbsp;&nbsp;</span>
                                        <input type="date"
                                               onChange={(e) => handleDateChange(e, "MAX")}
                                               value={dateMax.value}
                                               className="smxl:w-1/2 w-full p-2 text-lg rounded-lg border-[1px] border-neutral-500"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex smxl:flex-row flex-col gap-6 lg:w-1/2 smxl:w-3/4 w-full">
                            <button
                                onClick={() => setApplyFilters(true)}
                                className="smxl:w-1/2 w-full p-4 text-center text-lg shadow-lg rounded-lg bg-green-standard hover:bg-green-500 text-white transition">
                                Apply Filters
                            </button>
                            <button
                                onClick={() => setResetFilters(true)}
                                className="smxl:w-1/2 w-full p-4 text-center text-lg shadow-lg rounded-lg text-white bg-red-600 hover:bg-red-500 transition">
                                Reset
                            </button>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
};

export default OrdersReceiptsFilters;