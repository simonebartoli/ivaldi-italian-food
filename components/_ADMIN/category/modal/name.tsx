import React, {ChangeEvent} from 'react';
import {CategoryType} from "../../../../pages/categories";
import {NextPage} from "next";

type Props = {
    name: string
    currentProperty: {
        value: CategoryType
        set: React.Dispatch<React.SetStateAction<CategoryType>>
    }
}
const Name: NextPage<Props> = ({name, currentProperty}) => {

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        currentProperty.set({
            ...currentProperty.value,
            name: newValue !== name ? newValue : null
        })
    }

    return (
        <>
            <input
                onChange={(e) => handleNameChange(e)}
                value={currentProperty.value.name !== null ? currentProperty.value.name : name}
                placeholder={"Insert the name of the product here..."}
                type="text"
                className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
        </>
    );
};

export default Name;