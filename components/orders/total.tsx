import React from 'react';
import {AddressReactType} from "../../pages/checkout";
import {NextPage} from "next";

type Props = {
    summary: {
        reference: string
        shipping_address: AddressReactType
        price_total: number
        vat_total: number
    }
}

const Total: NextPage<Props> = ({summary}) => {
    return (
        <div className="flex flex-col bg-white p-6 w-full rounded-lg smxl:gap-6 gap-10">
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">ORDER ID:</span>
                <span className="text-xl font-semibold uppercase">{summary.reference}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">SHIPPING ADDRESS:</span>
                <span className="text-xl font-semibold">
                    {summary.shipping_address.first_address},&nbsp;
                    {summary.shipping_address.second_address && summary.shipping_address.second_address + ","}&nbsp;
                    {summary.shipping_address.postcode},&nbsp;
                    {summary.shipping_address.city},&nbsp;
                    UK
                </span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">TOTAL (NO VAT):</span>
                <span className="text-xl font-semibold">£{(summary.price_total - summary.vat_total).toFixed(2)}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">VAT:</span>
                <span className="text-xl font-semibold">£{summary.vat_total.toFixed(2)}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start pt-6 border-t-[1px] border-neutral-500 border-dashed">
                <span className="text-2xl text-green-standard font-semibold">TOTAL (WITH VAT):</span>
                <span className="text-2xl font-semibold">£{(summary.price_total).toFixed(2)}</span>
            </div>
        </div>
    );
};

export default Total;