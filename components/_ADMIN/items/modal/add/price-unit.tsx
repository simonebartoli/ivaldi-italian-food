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

const PriceUnit: NextPage<Props> = ({product, invalid}) => {
    const handlePriceUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(newValue.length > 5 || newValue.length === 0) invalid.set(true)
        else invalid.set(false)

        product.set({
            ...product.value,
            price_unit: newValue
        })
    }

    return (
        <div>
            <div className="w-full flex flex-col gap-2">
                <span>Price Unit: </span>
                <input
                    value={product.value.price_unit !== null ? product.value.price_unit : ""}
                    onChange={(e) => handlePriceUnitChange(e)}
                    placeholder={"Insert the name of the product here..."}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
        </div>
    );
};

export default PriceUnit;