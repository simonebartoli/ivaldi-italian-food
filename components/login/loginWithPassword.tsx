import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import {BiLockAlt} from "react-icons/bi";
import {gql, useMutation} from "@apollo/client";
import validator from "validator";
import {moveLabel, revertLabel} from "../library/lableMover";
import {useAuth} from "../../contexts/auth-context";
import {Bars, ThreeDots} from "react-loader-spinner";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LOGIN_WITH_PASSWORD = gql`
    mutation LOGIN_WITH_PASSWORD($credentials: LoginWithPasswordInputs!){
        loginWithPassword(credentials: $credentials)
    }
`

const LoginWithPassword = () => {
    const {generateAccessToken} = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true)
    const [loader, setLoader] = useState(false)

    const firstEmailRef = useRef<HTMLDivElement>(null)
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
        if(newValue.length > 0) moveLabel(firstEmailRef)
        setEmail(newValue)
    }
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(newValue.length > 0) moveLabel(passwordRef)
        setPassword(newValue)
    }
    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>, inputName: string) => {
        switch (inputName){
            case "email-1":
                moveLabel(firstEmailRef)
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
                    case "password":
                        revertLabel(passwordRef)
                        break
                }
            }
        }
    }

    const [loginWithPassword] = useMutation(LOGIN_WITH_PASSWORD, {
        variables: {
            credentials: {
                email: email,
                password: password
            }
        },
        onCompleted: (data) => {
            toast.success("Good 🎉, You are Logged In")
            setLoginButtonDisabled(false)
            setLoader(false)
            generateAccessToken()
        },
        onError: (error) => {
            toast.error(error.message)
            setLoginButtonDisabled(false)
            setLoader(false)
        }
    })

    const onLoginFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoader(true)
        setLoginButtonDisabled(true)
        loginWithPassword()
    }


    return (
        <form onSubmit={(e) => onLoginFormSubmit(e)} className="flex flex-col gap-10 w-full">
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
                <button
                    type="submit" disabled={loginButtonDisabled}
                    className="flex justify-center relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer p-3 rounded-lg w-full shadow-lg text-white">
                    {
                        loader ?
                            <Bars height={24} color={"white"}/>
                            :
                            "Login"
                    }
                </button>
            </div>
        </form>
    );
};

export default LoginWithPassword;