import React, {useRef, useState} from 'react';
import {BiArrowToBottom} from "react-icons/bi";

const OrderBy = () => {
    const [optionSelected, setOptionSelected] = useState("Most Relevant")
    const contextMenuRef = useRef<HTMLDivElement>(null)
    const filtersRef = useRef<HTMLDivElement>(null)

    const handleContextMenuClick = () => {
        if(filtersRef.current !== null){
            filtersRef.current.classList.toggle("hidden")
        }
    }

    const handleOptionClick = (id: string | null) => {
        if(id !== null) setOptionSelected(id)
    }

    return (
        <div onClick={handleContextMenuClick} ref={contextMenuRef} className="border-b-[1px] border-neutral-300 flex smx:text-xl text-lg w-full flex-col justify-center items-center">
            <div className="p-6 flex flex-row justify-between items-center w-full hover:bg-neutral-100">
                <span>Order By: </span>
                <div className="flex flex-row items-center justify-center gap-4">
                    <span className="font-semibold underline underline-offset-8">{optionSelected}</span>
                    <BiArrowToBottom/>
                </div>
            </div>
            <div ref={filtersRef} className="hidden flex flex-col items-center w-full bg-neutral-100">
                {optionSelected !== "Most Relevant" && <span onClick={(e) => handleOptionClick((e.target as Element).textContent)}
                       className="w-full text-center p-6 border-t-[1px] border-neutral-200 hover:bg-neutral-200">Most Relevant</span>}
                {optionSelected !== "Price Ascending" && <span onClick={(e) => handleOptionClick((e.target as Element).textContent)}
                       className="w-full text-center p-6 border-t-[1px] border-neutral-200 hover:bg-neutral-200">Price Ascending</span>}
                {optionSelected !== "Price Descending" && <span onClick={(e) => handleOptionClick((e.target as Element).textContent)}
                       className="w-full text-center p-6 border-t-[1px] border-neutral-200 hover:bg-neutral-200">Price Descending</span>}
                {optionSelected !== "Higher Discounts" && <span onClick={(e) => handleOptionClick((e.target as Element).textContent)}
                       className="w-full text-center p-6 border-t-[1px] border-neutral-200 hover:bg-neutral-200 rounded-b-lg">Higher Discounts</span>}
            </div>
        </div>
    );
};

export default OrderBy;