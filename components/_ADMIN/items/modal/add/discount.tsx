import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    },
    invalid: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
}

const Discount: NextPage<Props> = ({product, invalid}) => {
    const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) {
            if(Number(newValue) > 100) invalid.set(true)
            else invalid.set(false)

            product.set({
                ...product.value,
                discount: newValue
            })
        }
    }
    const handleBlurDiscountDecimals = () => {
        if(product.value.discount !== null) {
            product.set({
                ...product.value,
                discount: Number(product.value.discount).toFixed(2)
            })
        }
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>Discount %:</span>
            <input
                value={product.value.discount !== null ? product.value.discount : ""}
                onChange={(e) => handleDiscountChange(e)}
                placeholder={"Insert the discount of the product here... (leave blank for no discount)"}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Discount;