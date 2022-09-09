import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    item: {
        description: string
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

const Description: NextPage<Props> = ({item, currentProperty, invalid}) => {
    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value

        if(newValue !== item.description) {
            if(newValue.length < 10 || newValue.length > 200) invalid.set(true)
            else invalid.set(false)
            currentProperty.set({...currentProperty.value, description: newValue})
        }else {
            currentProperty.set({...currentProperty.value, description: null})
        }
    }

    return (
        <div className="w-full">
            <textarea
                value={currentProperty.value["description"] !== null ? currentProperty.value["description"] : item.description}
                onChange={(e) => handleDescriptionChange(e)}
                placeholder={"Insert the description of the product here..."}
                className="p-3 w-full border-[1px] rounded-lg shadow-md resize-y"/>
        </div>
    );
};

export default Description;