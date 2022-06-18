import React, {ChangeEvent, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import validator from "validator";
import {ImCross} from "react-icons/im";
import SlideDown from "react-slidedown";


const Email = () => {
    const [email, setEmail] = useState("")
    const [changeOptionSelected, setChangeOptionSelected] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if(validator.isEmail(e.target.value)) {
            setErrorMessage("")
            setDisabled(false)
        }
        else {
            setErrorMessage("Email Not Valid")
            setDisabled(true)
        }
    }

    const onEmailChangeOptionSelected = () => {
        setChangeOptionSelected(!changeOptionSelected)
    }

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="w-full flex flex-row justify-between items-start">
                <div className="flex flex-row items-center justify-center gap-8">
                    <HiOutlineMail className="text-6xl"/>
                    <div className="flex flex-col gap-2">
                        <span className="text-neutral-600">Email</span>
                        <span className="font-semibold text-2xl text-green-standard">info@bartolisimone.com</span>
                    </div>
                </div>
                <button onClick={onEmailChangeOptionSelected} className={`${changeOptionSelected ? "p-5 hover:bg-red-500 bg-red-600" : "p-4 hover:bg-green-500 bg-green-standard"} transition px-8 shadow-lg rounded-lg text-white text-xl text-center`}>
                    {
                        changeOptionSelected ?
                            <ImCross/> :
                            "Edit"
                    }
                </button>
            </div>
            <SlideDown className={"w-full"}>
                {changeOptionSelected ?
                <div className="mt-12 transition-all flex flex-col gap-4 items-start justify-start w-full">
                    <div className="flex flex-col gap-2 relative w-1/3">
                        <div className="pointer-events-none select-none transition-all text-neutral-500 text-lg flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <HiOutlineMail className="mt-[1px]"/>
                                <span className="font-navbar">Email</span>
                            </div>
                            <span className="text-red-600 italic text-sm">{errorMessage}</span>
                        </div>
                        <input
                            value={email} onChange={(e) => onEmailChange(e)}
                            placeholder="Insert your new email here..."
                            type="text"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                    <button disabled={disabled} className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black p-4 bg-green-standard text-white text-xl text-center shadow-lg w-1/3 rounded-lg">Change Email</button>
                </div> : null}
            </SlideDown>
        </div>
    );
};

export default Email;