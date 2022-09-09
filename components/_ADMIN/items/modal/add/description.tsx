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

const Description: NextPage<Props> = ({product, invalid}) => {
    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        if(newValue.length < 20 || newValue.length > 200) invalid.set(true)
        else invalid.set(false)

        product.set({
            ...product.value,
            description: newValue
        })
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <span>Description: </span>
            <textarea
                value={product.value.description !== null ? product.value.description : ""}
                onChange={(e) => handleDescriptionChange(e)}
                placeholder={"Insert the description of the product here..."}
                className="p-3 w-full border-[1px] rounded-lg shadow-md resize-y"/>
        </div>
    );
};

export default Description;