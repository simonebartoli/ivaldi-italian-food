import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    },
    changeInvalidDetails: (id: string, value: boolean) => void
}

const Stock: NextPage<Props> = ({product, changeInvalidDetails}) => {
    const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*$/gm
        const OK = pattern.test(newValue)
        if(OK) {
            if(Number(newValue) > 1000 || newValue.length === 0) changeInvalidDetails("stock", true)
            else changeInvalidDetails("stock", false)
            product.set({...product.value, amount_available: Number(newValue)})
        }
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>Stock Unit Available:</span>
            <input
                value={product.value.amount_available !== null ? product.value.amount_available : ""}
                onChange={(e) => handleStockChange(e)}
                placeholder={"Insert the amount available of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Stock;