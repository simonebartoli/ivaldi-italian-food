import React, {ChangeEvent, RefObject, useEffect, useRef, useState} from 'react';
import {moveLabel, revertLabel} from "../library/lableMover";
import {BiLockAlt} from "react-icons/bi";
import {Bars} from "react-loader-spinner";

type Props = {
    password: string
    confirmPassword: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
    loading: boolean
    handleSubmitForm: () => void
    moveBack: (oldRef: number, newRef: number) => void
}

const Password = React.forwardRef<HTMLDivElement, Props>(({password, setPassword, confirmPassword, setConfirmPassword, loading, handleSubmitForm, moveBack}, ref) => {
    const [thirdSectionButtonDisabled, setThirdSectionButtonDisabled] = useState(true)
    const [thirdButtonErrors, setThirdButtonErrors] = useState({
        password: {
            status: false,
            message: ""
        },
        confirmPassword: {
            status: false,
            message: ""
        }
    })

    const passwordRef = useRef<HTMLDivElement>(null)
    const confirmPasswordRef = useRef<HTMLDivElement>(null)
    const firstReqRef = useRef<HTMLLIElement>(null)
    const secondReqRef = useRef<HTMLLIElement>(null)

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setConfirmPassword("")
        revertLabel(confirmPasswordRef)
        setPassword(newValue)

        if(newValue.length >= 8){
            if(firstReqRef.current !== null) firstReqRef.current.style.textDecorationLine = "line-through"
        }else{
            if(firstReqRef.current !== null) firstReqRef.current.style.textDecorationLine = "none"
        }
        if(/[a-zA-Z]/g.test(newValue) && /\d/g.test(newValue)){
            if(secondReqRef.current !== null) secondReqRef.current.style.textDecorationLine = "line-through"
        }else{
            if(secondReqRef.current !== null) secondReqRef.current.style.textDecorationLine = "none"
        }

        if(/[a-zA-Z]/g.test(newValue) && /\d/g.test(newValue) && newValue.length >= 8){
            setThirdButtonErrors({
                ...thirdButtonErrors,
                password: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setThirdButtonErrors({
                ...thirdButtonErrors,
                password: {
                    status: false,
                    message: "Password does not meet requirements"
                }
            })
        }
    }
    const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setConfirmPassword(newValue)
        if(newValue === password){
            setThirdButtonErrors({
                ...thirdButtonErrors,
                confirmPassword: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setThirdButtonErrors({
                ...thirdButtonErrors,
                confirmPassword: {
                    status: false,
                    message: "This password is different"
                }
            })
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, ref: RefObject<HTMLDivElement>, date: boolean) => {
        const newValue = e.target.value
        if(newValue === ""){
            revertLabel(ref)
            if(date) e.target.type = "date"
        }
    }

    useEffect(() => {
        let OK = true
        for(const value of Object.values(thirdButtonErrors)){
            if(!value.status) OK = false
        }
        if(OK) setThirdSectionButtonDisabled(false)
        else setThirdSectionButtonDisabled(true)
    }, [thirdButtonErrors])

    useEffect(() => {
        if(loading) setThirdSectionButtonDisabled(true)
        else setThirdButtonErrors({...thirdButtonErrors})
    }, [loading])

    return (
        <div ref={ref} className="hidden flex flex-col gap-16 items-center xls:w-1/3 mdx:w-1/2 sm:w-2/3 smxl:w-3/4 w-full pb-16">
            <span className="text-lg text-center leading-10">To finish the registration choose a strong password and<br/> then click Sign Up</span>
            <div className="flex flex-col gap-8 w-full">
                <div className="mt-8 smxl:mt-0 flex flex-col relative w-full">
                    <span className="absolute text-red-600 w-full text-right -top-14 left-0">{thirdButtonErrors.password.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={passwordRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <BiLockAlt className="mt-[1px]"/>
                            <span className="font-navbar">Password</span>
                        </div>
                        <input
                            value={password} onChange={(e) => onPasswordChange(e)}
                            onFocus={() => moveLabel(passwordRef)}
                            onBlur={(e) => onInputBlur(e, passwordRef, false)}
                            type="password"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
                <div className="w-full p-4 bg-neutral-100 space-y-4 text-gray-700 mb-4">
                    <span>Your Password should: </span>
                    <ul className="list-disc list-inside space-y-2">
                        <li ref={firstReqRef}>be 8 chars long</li>
                        <li ref={secondReqRef}>have at least a number and a letter</li>
                    </ul>
                </div>
                <div className="mt-8 smxl:mt-0 flex flex-col relative w-full">
                    <span className="absolute text-red-600 w-full text-right -top-14 left-0">{thirdButtonErrors.confirmPassword.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={confirmPasswordRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <BiLockAlt className="mt-[1px]"/>
                            <span className="font-navbar">Confirm Password</span>
                        </div>
                        <input
                            value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e)}
                            onFocus={() => moveLabel(confirmPasswordRef)}
                            onBlur={(e) => onInputBlur(e, confirmPasswordRef, false)}
                            type="password"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-row justify-between gap-4">
                    <button onClick={() => moveBack(2, 1)} className="w-full p-4 text-center bg-red-600 rounded-lg text-white border-2 border-black shadow-lg basis-1/3">Back</button>
                    <button
                        onClick={handleSubmitForm}
                        disabled={thirdSectionButtonDisabled}
                        className="flex items-center justify-center transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg basis-2/3">
                        {
                            !loading ? "Sign Up" : <Bars height={24} color={"white"}/>
                        }
                    </button>
                </div>
                <span className="text-right">* By Clicking &quot;Sign Up&quot; you accept our Terms & Conditions</span>
            </div>
        </div>
    );
});

Password.displayName = "Password"
export default Password;