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

const Name: NextPage<Props> = ({product, changeInvalidDetails}) => {
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(newValue.length < 3 || newValue.length > 499) changeInvalidDetails("name",true)
        else changeInvalidDetails("name",false)

        product.set({
            ...product.value,
            name: newValue
        })
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>Name: </span>
            <input
                value={product.value.name !== null ? product.value.name : ""}
                onChange={(e) => handleNameChange(e)}
                placeholder={"Insert the name of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Name;