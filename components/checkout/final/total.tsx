import React from 'react';
import {NextPage} from "next";

type Props = {
    total: number
    vatTotal: number
}

const Total: NextPage<Props> = ({total, vatTotal}) => {
    return (
        <div className="text-xl p-8 bg-neutral-100 rounded-lg flex flex-col w-full gap-8">
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold">Total (no VAT):</span>
                <span>£{Number((total - vatTotal).toFixed(2))}</span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold">VAT:</span>
                <span>£{vatTotal}</span>
            </div>
            <span className="border-t-[1px] bg-neutral-500 w-full"/>
            <div className="w-full flex flex-row justify-between items-center">
                <span className="font-semibold text-3xl">Total (with VAT):</span>
                <span className="text-3xl font-semibold">£{total}</span>
            </div>
        </div>
    );
};

export default Total;