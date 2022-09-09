import React from 'react';
import {NextPage} from "next";
import {CurrentProduct} from "./edit-form";
import {Bars} from "react-loader-spinner";

type Props = {
    invalid: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleFormSubmit: () => void
    loading: boolean

    type: "EDIT" | "REMOVE" | "ADD"
    currentProperty?: CurrentProduct
}
const Buttons: NextPage<Props> = ({invalid, currentProperty, setModalOpen, handleFormSubmit, loading, type}) => {

    const checkIfChanged = () => {
        if(currentProperty !== undefined && type === "EDIT"){
            for(const [key, value] of Object.entries(currentProperty)){
                if(value !== null) return true
            }
            return false
        }else{
            return true
        }
    }

    const checkIfAllPropertySet = () => {
        if(currentProperty !== undefined && type === "ADD"){
            for(const [key, value] of Object.entries(currentProperty)){
                if(value === null) return false
            }
            return true
        }else{
            return true
        }
    }

    return (
        <div className="w-full flex flex-col gap-8">
            {
                currentProperty !== undefined &&
                <span className="text-center text-neutral-500 italic text-sm">You don&apos;t need to save every single edit. Save when everything has been modified</span>
            }
            <div className="w-full flex flex-row gap-8">
                <button
                    onClick={handleFormSubmit}
                    disabled={invalid || !checkIfChanged() || loading || !checkIfAllPropertySet()}
                    className={
                        `flex items-center justify-center disabled:cursor-not-allowed disabled:bg-neutral-500 p-3 w-1/2 
                        text-lg ${(type === "EDIT" || type === "ADD") ? "bg-green-standard hover:bg-green-500" : "bg-red-600 hover:bg-red-500"} text-white rounded-lg shadow-md transition`
                    }
                    type="submit">
                    {
                        loading ?
                            <Bars height={24} color={"white"}/>
                            :
                            ((type === "EDIT" || type === "ADD") ? "Save" : type === "REMOVE" && "Remove")
                    }
                </button>
                <button
                    onClick={() => setModalOpen(false)}
                    className={
                        `p-3 w-1/2 text-lg text-white rounded-lg
                         shadow-md ${(type === "EDIT" || type === "ADD") ? "bg-red-600 hover:bg-red-500" : "bg-neutral-500 hover:bg-neutral-400"} transition`
                    }
                    type="submit">
                    Discard
                </button>
            </div>
        </div>
    );
};

export default Buttons;