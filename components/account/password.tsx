import React, {useState} from 'react';
import {FiLock} from "react-icons/fi";
import {ImCross} from "react-icons/im";

const Password = () => {
    const [changeOptionSelected, setChangeOptionSelected] = useState(false)

    const onPasswordChangeOptionSelected = () => {
        setChangeOptionSelected(!changeOptionSelected)
    }

    return (
        <div className="flex flex-row justify-between items-start bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="flex flex-row items-center justify-center gap-8">
                <FiLock className="text-6xl"/>
                <div className="flex flex-col gap-2">
                    <span className="text-neutral-600">Password</span>
                    <span className="font-semibold text-2xl text-green-standard">**********</span>
                </div>
            </div>
            <button onClick={onPasswordChangeOptionSelected} className={`${changeOptionSelected ? "p-5 hover:bg-red-500 bg-red-600" : "p-4 hover:bg-green-500 bg-green-standard"} transition px-8 shadow-lg rounded-lg text-white text-xl text-center`}>
                {
                    changeOptionSelected ?
                        <ImCross/> :
                        "Edit"
                }
            </button>
        </div>
    );
};

export default Password;