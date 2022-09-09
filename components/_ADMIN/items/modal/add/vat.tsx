import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

const Vat: NextPage<Props> = ({product}) => {
    const handleVatChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        product.set({
            ...product.value,
            vat: Number(newValue)
        })
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>VAT:</span>
            <select
                value={product.value.vat !== null ? product.value.vat : ""}
                onChange={(e) => handleVatChange(e)}
                className="w-full text-xl p-3 rounded-lg">
                <option value={""}>Choose a VAT...</option>
                <option value={20}>20%</option>
                <option value={5}>5%</option>
                <option value={0}>0%</option>
            </select>
        </div>
    );
};

export default Vat;