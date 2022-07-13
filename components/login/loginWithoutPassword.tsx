import React, {FormEvent, useRef, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import validator from "validator";
import {moveLabel, revertLabel} from "../library/lableMover";
import SecurityModal from "../securityModal";
import 'react-responsive-modal/styles.css';
import {gql, useMutation} from "@apollo/client";
import {Bars} from "react-loader-spinner";
import {toast} from "react-toastify";

const LOGIN_WITHOUT_PASSWORD = gql`
    mutation LOGIN_WITHOUT_PASSWORD ($data: LoginWithoutPasswordInputs!){
        loginWithoutPassword(data: $data)
    }
`
type LoginWithoutPasswordType = {
    loginWithoutPassword: string
}

const LoginWithoutPassword = () => {
    const [emailRecover, setEmailRecover] = useState("")
    const secondEmailRef = useRef<HTMLDivElement>(null)
    const [loginRecoveryButtonDisabled, setLoginRecoveryButtonDisabled] = useState(true)

    const [modalOpen, setModalOpen] = useState(false)
    const [sixDigitCode, setSixDigitCode] = useState("AAAAAA")
    const [loginWithoutPassword, {loading}] = useMutation(LOGIN_WITHOUT_PASSWORD, {
        onCompleted: (data: LoginWithoutPasswordType) => {
            setSixDigitCode(data.loginWithoutPassword)
            setModalOpen(true)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSecondEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(newValue.length > 0) moveLabel(secondEmailRef)
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

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = {
            email: emailRecover
        }
        loginWithoutPassword({
            variables: {
                data: data
            }
        })
    }

    return (
        <form onSubmit={(e) => handleFormSubmit(e)} className="w-full flex smxl:flex-row flex-col justify-between smxl:gap-4 gap-8">
            <SecurityModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                sixDigitCode={sixDigitCode}
                content={{
                    title: "Almost Done 🎉",
                    description: "To proceed we need to verify your identity. Also if you haven't verified your email before, this will do it automatically."
                }}
            />
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
            <button
                type="submit" disabled={loginRecoveryButtonDisabled}
                className="flex items-center justify-center transition hover:bg-green-500 basis-1/3 bg-green-standard disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer shadow-md smxl:p-2 p-3 w-full rounded-lg text-white h-full text-lg">
                {
                    loading ? <Bars height={24} color={"white"}/> : "Login"
                }
            </button>
        </form>
    );
};

export default LoginWithoutPassword;