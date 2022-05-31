import React, {useEffect, useRef, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import {BiLockAlt} from "react-icons/bi";
import validator from "validator";
import {moveLabel, revertLabel} from "../library/lableMover";

const LoginSection = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailRecover, setEmailRecover] = useState("")

    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true)
    const [loginRecoveryButtonDisabled, setLoginRecoveryButtonDisabled] = useState(true)

    const firstEmailRef = useRef<HTMLDivElement>(null)
    const secondEmailRef = useRef<HTMLDivElement>(null)
    const passwordRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(validator.isEmail(email) && password.length >= 8 && password.length <= 31){
            setLoginButtonDisabled(false)
        }else{
            setLoginButtonDisabled(true)
        }
    }, [email, password])

    const onFirstEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setEmail(newValue)
    }
    const onSecondEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setEmailRecover(newValue)
        if(validator.isEmail(newValue)) setLoginRecoveryButtonDisabled(false)
        else setLoginRecoveryButtonDisabled(true)
    }
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setPassword(newValue)
    }

    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>, inputName: string) => {
        const newValue = e.target.value
        console.log(newValue)
        switch (inputName){
            case "email-1":
                moveLabel(firstEmailRef)
                break
            case "email-2":
                moveLabel(secondEmailRef)
                break
            case "password":
                moveLabel(passwordRef)
                break
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, inputName: string) => {
        const newValue = e.target.value
        if(newValue === ""){
            if(firstEmailRef.current !== null){
                switch (inputName){
                    case "email-1":
                        revertLabel(firstEmailRef)
                        break
                    case "email-2":
                        revertLabel(secondEmailRef)
                        break
                    case "password":
                        revertLabel(passwordRef)
                        break
                }
            }
        }
    }

    return (
        //border-[1px] shadow-lg border-neutral-400 md:rounded-l-lg rounded-t-lg
        <article className="flex flex-col items-center justify-center basis-1/3 grow p-8 md:py-8 py-14 bg-neutral-100 self-stretch">
            <div className="flex flex-col gap-12 items-center">
                <h2 className="text-2xl">Login</h2>
                <div className="flex flex-col gap-10 w-full">
                    <form className="flex flex-col gap-10 w-full">
                        <div className="flex flex-col relative">
                            <div ref={firstEmailRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <HiOutlineMail className="mt-[1px]"/>
                                <span className="font-navbar">Email</span>
                            </div>
                            <input onBlur={(e) => onInputBlur(e,"email-1")}
                                   onFocus={(e) => onInputFocus(e,"email-1")}
                                   onChange={(e) => onFirstEmailChange(e)}
                                   value={email}
                                   type="email" className="w-full p-2 text-lg border-[1px] border-neutral-400 rounded-lg"/>
                        </div>
                        <div className="flex flex-col relative">
                            <div ref={passwordRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <BiLockAlt className="mt-[1px]"/>
                                <span className="font-navbar">Password</span>
                            </div>
                            <input onBlur={(e) => onInputBlur(e,"password")}
                                   onFocus={(e) => onInputFocus(e,"password")}
                                   onChange={(e) => onPasswordChange(e)}
                                   value={password}
                                   type="password" className="w-full p-2 text-lg border-[1px] border-neutral-400 rounded-lg"/>
                        </div>
                        <div className="button-animated hover:before:w-full before:bg-[#008c2e] z-0 bg-green-standard border-black border-2 rounded-lg basis-1/3">
                            <input
                                type="submit" value="Login" disabled={loginButtonDisabled}
                                className="relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer p-3 rounded-lg w-full shadow-lg text-white"/>
                        </div>
                    </form>
                    <span className="w-full pt-[1px] bg-neutral-400"/>
                    <p className="text-center">
                        You don&apos;t remember the Password? Insert your email below.
                    </p>
                    <form className="w-full flex smxl:flex-row flex-col justify-between smxl:gap-4 gap-8">
                        <div className="flex flex-col relative basis-2/3">
                            <div ref={secondEmailRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <HiOutlineMail className="mt-[1px]"/>
                                <span className="font-navbar">Email</span>
                            </div>
                            <input onBlur={(e) => onInputBlur(e,"email-2")}
                                   onFocus={(e) => onInputFocus(e,"email-2")}
                                   onChange={(e) => onSecondEmailChange(e)}
                                   value={emailRecover}
                                   type="email" className="w-full p-2 text-lg border-[1px] border-neutral-400 rounded-lg"/>
                        </div>
                        <div className="button-animated hover:before:w-full before:bg-[#008c2e] z-0 bg-green-standard border-black border-2 rounded-lg basis-1/3">
                            <input type="submit" value="Login" disabled={loginRecoveryButtonDisabled}
                                   className="relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer smxl:p-2 p-3 w-full shadow-lg disabled:rounded-lg text-white h-full"/>
                        </div>
                    </form>
                </div>
            </div>
        </article>
    );
};

export default LoginSection;