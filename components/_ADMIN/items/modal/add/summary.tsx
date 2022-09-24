import React from 'react';
import {NextPage} from "next";

type Props = {
    price_original: number | null
    vat: number | null
    discount: number | null
}

const Summary: NextPage<Props> = ({price_original, vat, discount}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Price Total (No Discounts):</span>
                <span className="text-xl">
                    {price_original === null ? "Price Not Set" : `£ ${(price_original * (1 + (vat !== null ? vat : 0)/100)).toFixed(2)}`}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <span>Price Total (With Discounts):</span>
                <span className="text-xl font-semibold">
                    {price_original === null ? "Price Not Set" : `£ ${(price_original * (1 + (vat !== null ? vat : 0)/100) * (1 - (discount !== null ? discount : 0)/100)).toFixed(2)}`}
                </span>
            </div>
        </div>
    );
};

export default Summary;