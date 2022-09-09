import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    item: {
        amount_available: number
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
const Stock: NextPage<Props> = ({item, currentProperty, invalid}) => {
    const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*$/gm
        const OK = pattern.test(newValue)
        if(OK) {
            if(Number(newValue) === item.amount_available){
                currentProperty.set({...currentProperty.value, amount_available: null})
            }else{
                if(Number(newValue) > 1000 || newValue.length === 0) invalid.set(true)
                else invalid.set(false)
                currentProperty.set({...currentProperty.value, amount_available: Number(newValue)})
            }
        }
    }
    return (
        <div className="w-full flex flex-col gap-3">
            <span>Stock Unit Available:</span>
            <input
                value={currentProperty.value["amount_available"] !== null ? currentProperty.value["amount_available"] as number : item.amount_available}
                onChange={(e) => handleStockChange(e)}
                placeholder={"Insert the amount available of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Stock;