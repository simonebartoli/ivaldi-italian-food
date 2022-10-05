import React, {ChangeEvent} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    item: {
        name: string
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

const Name: NextPage<Props> = ({item, currentProperty, invalid}) => {
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value

        if(newValue !== item.name) {
            if(newValue.length < 3 || newValue.length > 499) invalid.set(true)
            else invalid.set(false)
            currentProperty.set({...currentProperty.value, name: newValue})
        }else {
            currentProperty.set({...currentProperty.value, name: null})
        }
    }

    return (
        <div className="w-full">
            <input
                value={currentProperty.value["name"] !== null ? currentProperty.value["name"] : item.name}
                onChange={(e) => handleNameChange(e)}
                placeholder={"Insert the name of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </div>
    );
};

export default Name;