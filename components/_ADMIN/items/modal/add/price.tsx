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

const Price: NextPage<Props> = ({product, changeInvalidDetails}) => {
    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) {
            if(Number(newValue) < 0) changeInvalidDetails("price", true)
            else changeInvalidDetails("price", false)

            product.set({
                ...product.value,
                price_original: newValue
            })
        }
    }
    const handleBlurPriceDecimals = () => {
        if(product.value.price_original !== null) {
            product.set({
                ...product.value,
                price_original: Number(product.value.price_original).toFixed(2)
            })
        }
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>Price (No Discounts - No VAT):</span>
            <input
                value={product.value.price_original !== null ? product.value.price_original : ""}
                onChange={(e) => handlePriceChange(e)}
                onBlur={handleBlurPriceDecimals}
                placeholder={"Insert the price of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Price;