import React, {useState} from 'react';
import EditForm from "../addresses/edit-form";
import {NextPage} from "next";

type Props = {
    setShowAddAddressForm: React.Dispatch<React.SetStateAction<boolean>>
}

const AddAddress: NextPage<Props> = ({setShowAddAddressForm}) => {
    const [disabled, setDisabled] = useState(true)

    const handleOnCancelClick = () => {
        setShowAddAddressForm(false)
    }

    return (
        <div className="w-full p-8 border-neutral-400 rounded-lg border-[1px] flex flex-col items-center justify-center gap-6">
            <EditForm
                currentFirstAddress={""}
                currentSecondAddress={""}
                currentPostcode={""}
                currentCity={""}
                currentNotes={""}
                style={{
                    mainPadding: "p-0 py-6",
                    width: "w-full"
                }}
                setDisabled={setDisabled}
            />
            <div className="flex flex-row w-full justify-between items-center gap-8">
                <button onClick={handleOnCancelClick} className="hover:bg-red-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-red-600">Cancel</button>
                <button disabled={disabled} className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-green-standard">Save</button>
            </div>
        </div>
    );
};

export default AddAddress;