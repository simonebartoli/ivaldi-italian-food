import React from 'react';
import {NextPage} from "next";

type Props = {
    total: number
    vatTotal: number
    shippingTotal: number
}

const Total: NextPage<Props> = ({total, vatTotal, shippingTotal}) => {
    return (
        <div className="text-xl p-8 bg-neutral-100 rounded-lg flex flex-col w-full gap-8">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold">Total (no VAT, no Shipping):</span>
                <span>£{Number((total - vatTotal - shippingTotal).toFixed(2))}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold">VAT:</span>
                <span>£{vatTotal.toFixed(2)}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold">Shipping:</span>
                <span>£{shippingTotal.toFixed(2)}</span>
            </div>
            <span className="border-t-[1px] bg-neutral-500 w-full"/>
            <div className="w-full flex smxl:flex-row smxl:gap-0 gap-6 flex-col justify-between smxl:items-center items-end">
                <span className="font-semibold text-3xl">Total:</span>
                <span className="text-3xl font-semibold">£{total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default Total;