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

const PriceUnit: NextPage<Props> = ({product, changeInvalidDetails}) => {
    const handlePriceUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(newValue.length > 15 || newValue.length === 0) changeInvalidDetails("price_unit",true)
        else changeInvalidDetails("price_unit",false)

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