import React, {useRef, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import validator from "validator";
import {moveLabel, revertLabel} from "../library/lableMover";

const LoginWithoutPassword = () => {
    const [emailRecover, setEmailRecover] = useState("")
    const [loginRecoveryButtonDisabled, setLoginRecoveryButtonDisabled] = useState(true)
    const secondEmailRef = useRef<HTMLDivElement>(null)
    const onSecondEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setEmailRecover(newValue)
        if(validator.isEmail(newValue)) setLoginRecoveryButtonDisabled(false)
        else setLoginRecoveryButtonDisabled(true)
    }

    const onInputFocus = () => {
        moveLabel(secondEmailRef)
    }
    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if (newValue === "") {
            if (secondEmailRef.current !== null) {
                revertLabel(secondEmailRef)
            }
        }
    }
    return (
        <form className="w-full flex smxl:flex-row flex-col justify-between smxl:gap-4 gap-8">
            <div className="flex flex-col relative basis-2/3">
                <div ref={secondEmailRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                    <HiOutlineMail className="mt-[1px]"/>
                    <span className="font-navbar">Email</span>
                </div>
                <input onBlur={(e) => onInputBlur(e)}
                       onFocus={onInputFocus}
                       onChange={(e) => onSecondEmailChange(e)}
                       value={emailRecover}
                       type="email" className="w-full p-2 text-lg border-[1px] border-neutral-400 rounded-lg"/>
            </div>
            <div className="button-animated hover:before:w-full before:bg-[#008c2e] z-0 bg-green-standard border-black border-2 rounded-lg basis-1/3">
                <input type="submit" value="Login" disabled={loginRecoveryButtonDisabled}
                       className="relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer smxl:p-2 p-3 w-full shadow-lg disabled:rounded-lg text-white h-full"/>
            </div>
        </form>
    );
};

export default LoginWithoutPassword;