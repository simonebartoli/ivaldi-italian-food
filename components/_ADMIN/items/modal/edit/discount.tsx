import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    item: {
        price_total: number
        discount: number | null
    },
    currentProperty: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    },
    invalid: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
}

const Discount: NextPage<Props> = ({item, currentProperty, invalid}) => {

    const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) {
            if(String(newValue) === String(item.discount)) {
                invalid.set(false)
                currentProperty.set({...currentProperty.value, discount: null})
            }else {
                if(Number(newValue) > 100) invalid.set(true)
                else invalid.set(false)
                currentProperty.set({...currentProperty.value, discount: newValue})
            }
        }
    }
    const handleBlurDiscountDecimals = () => {
        if(currentProperty.value["discount"] !== null) {
            currentProperty.set({...currentProperty.value, discount: Number(currentProperty.value["discount"]).toFixed(2)})
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Discount Percentage:</span>
                <input
                    onBlur={handleBlurDiscountDecimals}
                    onChange={(e) => handleDiscountChange(e)}
                    value={
                        currentProperty.value["discount"] !== null ? currentProperty.value["discount"] :
                        (item.discount !== null ? item.discount : "")
                    }
                    placeholder={"Insert the discount of the product here... (leave blank for no discount)"}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
            <div className="my-6 flex flex-col gap-3 text-lg">
                <span>Price Total (VAT + Discount):</span>
                <span className="font-semibold">
                    {`£ ${currentProperty.value["price_total"] !== null ? currentProperty.value["price_total"] as number : item.price_total}`}
                </span>
            </div>
        </div>
    );
};

export default Discount;