import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {FiLock} from "react-icons/fi";
import {ImCross} from "react-icons/im";
import {BiLockAlt} from "react-icons/bi";
import Slidedown from "react-slidedown";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../contexts/auth-context";
import {toast} from "react-toastify";
import {Bars} from "react-loader-spinner";

type ChangePasswordType = {
    data: {
        newPassword: string
    }
}

const CHANGE_PASSWORD = gql`
    mutation CHANGE_PASSWORD($data: ChangePasswordInput!) {
        changePassword(data: $data)
    }
`


const Password = () => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const [changePassword] = useMutation<true, ChangePasswordType>(CHANGE_PASSWORD, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoading(false)
            setChangeOptionSelected(false)
            toast.success("Password Changed Correctly.")
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            setLoading(false)
            console.log(error.message)
            toast.error("Sorry, there is a problem. Try Again.")
        }
    })


    const [changeOptionSelected, setChangeOptionSelected] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const [loading, setLoading] = useState(false)
    const [reTry, setReTry] = useState(false)

    const [errorMessage, setErrorMessage] = useState("")
    const [password, setPassword] = useState("")

    const firstReqRef = useRef<HTMLLIElement>(null)
    const secondReqRef = useRef<HTMLLIElement>(null)

    const onPasswordChangeOptionSelected = () => {
        setPassword("")
        setDisabled(true)
        setErrorMessage("")
        setChangeOptionSelected(!changeOptionSelected)
    }

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const OK = [false, false]
        setPassword(newValue)

        if(/[a-zA-Z]/g.test(newValue) && /\d/g.test(newValue)){
            if(secondReqRef.current !== null) secondReqRef.current.style.textDecorationLine = "line-through"
            OK[0] = true
        }else{
            OK[0] = false
            setErrorMessage("Char/Number missing")
            if(secondReqRef.current !== null) secondReqRef.current.style.textDecorationLine = "none"
        }

        if(newValue.length >= 8) {
            if(firstReqRef.current !== null) firstReqRef.current.style.textDecorationLine = "line-through"
            OK[1] = true
        }else{
            OK[1] = false
            setErrorMessage("Password is too short")
            if(firstReqRef.current !== null) firstReqRef.current.style.textDecorationLine = "none"
        }

        if(OK[0] && OK[1]) {
            setErrorMessage("")
            setDisabled(false)
        }
        else setDisabled(true)
    }

    const handleChangePasswordButtonClick = () => {
        setLoading(true)
        changePassword({
            variables: {
                data: {
                    newPassword: password
                }
            }
        })
    }

    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            handleChangePasswordButtonClick()
        }
    }, [accessToken, reTry])

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="w-full flex mdx:flex-row flex-col gap-8 mdx:gap-0 justify-between items-start">
                <div className="flex flex-row items-center justify-center gap-8">
                    <FiLock className="lg:text-6xl smxl:text-5xl text-4xl"/>
                    <div className="flex flex-col gap-2">
                        <span className="text-neutral-600">Password</span>
                        <span className="font-semibold lg:text-2xl smxl:text-xl text-lg text-green-standard">**********</span>
                    </div>
                </div>
                <button onClick={onPasswordChangeOptionSelected} className={`${changeOptionSelected ? "p-5 hover:bg-red-500 bg-red-600" : "p-4 hover:bg-green-500 bg-green-standard"} flex flex-col justify-center items-center mdx:w-fit w-full transition px-8 shadow-lg rounded-lg text-white lg:text-xl text-lg text-center`}>
                    {
                        changeOptionSelected ?
                            <ImCross/> :
                            "Edit"
                    }
                </button>
            </div>
            <Slidedown className="w-full">
                {changeOptionSelected ?
                    <div className="mt-12 transition-all flex flex-col gap-4 items-start justify-start w-full">
                        <div className="flex flex-col gap-2 relative lg:w-1/2 xls:w-1/3 w-full ">
                            <div
                                className="pointer-events-none select-none transition-all text-neutral-500 text-lg flex flex-row gap-2 justify-between items-center">
                                <div className="flex flex-row gap-2 items-center">
                                    <BiLockAlt className="mt-[1px]"/>
                                    <span className="font-navbar">Password</span>
                                </div>
                                <span className="text-red-600 italic text-sm">{errorMessage}</span>
                            </div>
                            <input
                                value={password} onChange={(e) => onPasswordChange(e)}
                                placeholder="Insert your new password here..."
                                type="password"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                        <div className="w-full p-4 bg-neutral-100 space-y-4 text-gray-700 mb-4">
                            <span>Your Password should: </span>
                            <ul className="list-disc list-inside space-y-2">
                                <li ref={firstReqRef}>be 8 chars long</li>
                                <li ref={secondReqRef}>have at least a number and a letter</li>
                            </ul>
                        </div>
                        <button onClick={handleChangePasswordButtonClick} disabled={disabled || loading}
                                className="flex items-center justify-center transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black p-4 bg-green-standard text-white text-xl text-center shadow-lg lg:w-1/2 xls:w-1/3 w-full rounded-lg">
                            {
                                loading ? <Bars height={24} color={"white"}/>
                                    : <>Change Password</>
                            }
                        </button>
                    </div>
                : null }
            </Slidedown>
        </div>
    );
};

export default Password;