import React, {ChangeEvent, useEffect, useState} from 'react';
import {HiOutlineMail} from "react-icons/hi";
import validator from "validator";
import {ImCross} from "react-icons/im";
import SlideDown from "react-slidedown";
import {NextPage} from "next";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../contexts/auth-context";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import {Bars} from "react-loader-spinner";
import {SERVER_ERRORS_ENUM} from "../../enums/SERVER_ERRORS_ENUM";

type Props = {
    email: string | null
    setEmail: React.Dispatch<React.SetStateAction<string | null>>
}

type ChangeEmailType = {
    data: {
        newEmail: string
    }
}

const CHANGE_EMAIL = gql`
    mutation CHANGE_EMAIL($data: ChangeEmailInput!) {
        changeEmail(data: $data)
    }
`

const Email: NextPage<Props> = ({email, setEmail}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const [changeEmail] = useMutation<true, ChangeEmailType>(CHANGE_EMAIL, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoading(false)
            setChangeOptionSelected(false)
            toast.success("Email Changed Correctly.")
            setEmail(newEmail)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            setLoading(false)
            console.log(error.message)
            if(error.graphQLErrors[0] !== undefined){
                if(error.graphQLErrors[0].extensions.type === SERVER_ERRORS_ENUM.EMAIL_ALREADY_USED) {
                    toast.error("This email has already been used. Try a different one.")
                    return
                }
            }
            toast.error("Sorry, there is a problem. Try Again.")
        }
    })

    const [newEmail, setNewEmail] = useState("")
    const [changeOptionSelected, setChangeOptionSelected] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [reTry, setReTry] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value)
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
        setNewEmail("")
        setDisabled(true)
        setErrorMessage("")
        setChangeOptionSelected(!changeOptionSelected)
    }

    const handleChangeEmailButtonClick = () => {
        setLoading(true)
        changeEmail({
            variables: {
                data: {
                    newEmail: newEmail
                }
            }
        })
    }

    useEffect(() => {
        if(accessToken.token !== null && reTry){
            setReTry(false)
            handleChangeEmailButtonClick()
        }
    }, [accessToken, reTry])

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="w-full flex mdx:flex-row flex-col gap-8 mdx:gap-0 justify-between items-start">
                <div className="flex flex-row items-center justify-center gap-8">
                    <HiOutlineMail className="lg:text-6xl smxl:text-5xl text-4xl"/>
                    <div className="flex flex-col gap-2">
                        <span className="text-neutral-600">Email</span>
                        <span className="font-semibold lg:text-2xl smxl:text-xl text-lg text-green-standard">
                            {email === null ? "Not Logged" : email}
                        </span>
                    </div>
                </div>
                <button onClick={onEmailChangeOptionSelected} className={`${changeOptionSelected ? "p-5 hover:bg-red-500 bg-red-600" : "p-4 hover:bg-green-500 bg-green-standard"} flex flex-col justify-center items-center mdx:w-fit w-full transition px-8 shadow-lg rounded-lg text-white lg:text-xl text-lg text-center`}>
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
                    <div className="flex flex-col gap-2 relative lg:w-1/2 xls:w-1/3 w-full">
                        <div className="pointer-events-none select-none transition-all text-neutral-500 text-lg flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <HiOutlineMail className="mt-[1px]"/>
                                <span className="font-navbar">Email</span>
                            </div>
                            <span className="text-red-600 italic text-sm">{errorMessage}</span>
                        </div>
                        <input
                            value={newEmail} onChange={(e) => onEmailChange(e)}
                            placeholder="Insert your new email here..."
                            type="text"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                    <button onClick={handleChangeEmailButtonClick} disabled={disabled || loading} className="flex items-center justify-center transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black p-4 bg-green-standard text-white text-xl text-center shadow-lg lg:w-1/2 xls:w-1/3 w-full rounded-lg">
                        {
                            loading ? <Bars height={24} color={"white"}/>
                                : <>Change Email</>
                        }
                    </button>

                </div> : null}
            </SlideDown>
        </div>
    );
};

export default Email;