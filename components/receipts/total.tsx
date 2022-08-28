import React from 'react';
import {BsDownload} from "react-icons/bs";
import {AddressReactType} from "../../pages/checkout";
import {NextPage} from "next";
import Link from "next/link";

type Props = {
    receipt: {
        reference: string
        type: "CARD" | "PAYPAL"
        account: string
        billing_address: AddressReactType
        price_total: number
    }
}

const Total: NextPage<Props> = ({receipt}) => {
    return (
        <div className="p-8 my-4 flex flex-col bg-white w-full rounded-lg mdx:gap-6 gap-10 w-[95%]">
            <div className="flex lg:flex-row flex-col lg:items-center items-start justify-start gap-4 text-xl">
                <span>ORDER ID:</span>
                <span className="font-semibold text-green-standard uppercase">{receipt.reference}</span>
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center items-start justify-start gap-4 text-xl">
                <span>PAYMENT METHOD:</span>
                <span className="font-semibold text-green-standard">{receipt.type} ({receipt.type === "CARD" && "ending"} {receipt.account})</span>
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center items-start justify-start gap-4 text-xl">
                <span>BILLING ADDRESS:</span>
                <span className="font-semibold text-green-standard">
                    {receipt.billing_address.first_address},&nbsp;
                    {receipt.billing_address.second_address && receipt.billing_address.second_address + ","}&nbsp;
                    {receipt.billing_address.postcode},&nbsp;
                    {receipt.billing_address.city},&nbsp;
                    {receipt.billing_address.country}
                </span>
            </div>
            <span className="border-dashed border-t-[1px] border-neutral-500 w-full"/>
            <div className="flex lg:flex-row flex-col lg:items-center items-start justify-start gap-4 text-2xl">
                <span>TOTAL (VAT INCLUDED):</span>
                <span className="font-semibold text-green-standard">£{receipt.price_total.toFixed(2)}</span>
            </div>
            <Link href={`/get-receipt?order_ref=${receipt.reference}`}>
                <div className="mt-8 cursor-pointer flex flex-row mdx:items-center items-start justify-start gap-4 text-lg">
                    <BsDownload/>
                    <span className="italic">Download Your PDF Receipt Here</span>
                </div>
            </Link>
        </div>
    );
};

export default Total;