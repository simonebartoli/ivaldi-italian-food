import React from 'react';
import {BsDownload} from "react-icons/bs";

const Total = () => {
    return (
        <div className="p-8 my-4 flex flex-col bg-white w-full rounded-lg mdx:gap-6 gap-10 w-[95%]">
            <div className="flex mdx:flex-row flex-col mdx:items-center items-start justify-start gap-4 text-xl">
                <span>ORDER ID:</span>
                <span className="font-semibold text-green-standard">986858985</span>
            </div>
            <div className="flex mdx:flex-row flex-col mdx:items-center items-start justify-start gap-4 text-xl">
                <span>PAYMENT METHOD:</span>
                <span className="font-semibold text-green-standard">DEBIT CARD (ending 5685)</span>
            </div>
            <div className="flex mdx:flex-row flex-col mdx:items-center items-start justify-start gap-4 text-xl">
                <span>BILLING ADDRESS:</span>
                <span className="font-semibold text-green-standard">1 Yeo Street, Caspian Wharf 40, E33AE, London, UK</span>
            </div>
            <span className="border-dashed border-t-[1px] border-neutral-500 w-full"/>
            <div className="flex mdx:flex-row flex-col mdx:items-center items-start justify-start gap-4 text-xl">
                <span>TOTAL (VAT INCLUDED):</span>
                <span className="font-semibold text-green-standard">£102.40</span>
            </div>
            <div className="mt-8 cursor-pointer flex flex-row mdx:items-center items-start justify-start gap-4 text-lg">
                <BsDownload/>
                <span className="italic">Download Your PDF Receipt Here</span>
            </div>
        </div>
    );
};

export default Total;