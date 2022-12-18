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

const Weight: NextPage<Props> = ({product, changeInvalidDetails}) => { // TODO ADD PARAM TO REQUEST
    const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(Number(newValue) === 0) changeInvalidDetails("weight",true)
        else changeInvalidDetails("weight",false)

        if(!isNaN(Number(newValue))){
            product.set({
                ...product.value,
                weight: Number(newValue)
            })
        }
    }

    return (
        <div>
            <div className="w-full flex flex-col gap-2">
                <span>Weight (g): </span>
                <input
                    value={product.value.weight !== null ? product.value.weight : ""}
                    onChange={(e) => handleWeightChange(e)}
                    placeholder={"Insert the weight of the product here..."}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
        </div>
    );
};

export default Weight;