import React from 'react';

const Total = () => {
    return (
        <div className="flex flex-col bg-white p-6 w-full rounded-lg smxl:gap-6 gap-10">
            <div className="flex smxl:flex-row flex-col gap-6 smxl:items-center items-start">
                <span className="sm:text-xl text-2xl text-green-standard font-semibold">ORDER ID:</span>
                <span className="sm:text-xl text-2xl font-semibold">100520362</span>
            </div>
            <div className="flex smxl:flex-row flex-col gap-6 smxl:items-center items-start">
                <span className="sm:text-xl text-2xl text-green-standard font-semibold">SHIPPING ADDRESS:</span>
                <span className="sm:text-xl text-2xl font-semibold">1 Yeo Street, Caspian Wharf 40, E33AE, London, UK</span>
            </div>
            <div className="flex smxl:flex-row flex-col gap-6 smxl:items-center items-start">
                <span className="sm:text-xl text-2xl text-green-standard font-semibold">TOTAL (NO VAT):</span>
                <span className="sm:text-xl text-2xl font-semibold">£50.20</span>
            </div>
            <div className="flex smxl:flex-row flex-col gap-6 smxl:items-center items-start">
                <span className="sm:text-xl text-2xl text-green-standard font-semibold">VAT:</span>
                <span className="sm:text-xl text-2xl font-semibold">£10.00</span>
            </div>
            <div className="flex smxl:flex-row flex-col gap-6 smxl:items-center items-start pt-6 border-t-[1px] border-neutral-500 border-dashed">
                <span className="sm:text-xl text-2xl text-green-standard font-semibold">TOTAL (WITH VAT):</span>
                <span className="sm:text-xl text-2xl font-semibold">£62.20</span>
            </div>
        </div>
    );
};

export default Total;