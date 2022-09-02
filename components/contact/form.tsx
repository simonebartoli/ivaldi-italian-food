import React, {FormEvent, useEffect, useState} from 'react';
import validator from "validator";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {Bars} from "react-loader-spinner";

const CREATE_NEW_CONTACT_REQUEST = gql`
    mutation CREATE_NEW_CONTACT_REQUEST($data: CreateNewContactRequestInput!) {
        createNewContactRequest(data: $data)
    }
`
type CreateNewContactRequestType = {
    createNewContactRequest: true
}
type CreateNewContactRequestVarType = {
    data: {
        name: string,
        surname: string,
        email: string,
        phone_number: string,
        message: string
    }
}


const Form = () => {
    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        message: ""
    })
    const [inputsValue, setInputsValue] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        message: ""
    })

    const [approved, setApproved] = useState({
        name: false,
        surname: false,
        email: false,
        phone: false,
        message: false
    })
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const [CreateNewContactRequest] = useMutation<CreateNewContactRequestType, CreateNewContactRequestVarType>(CREATE_NEW_CONTACT_REQUEST, {
        variables: {
            data: {
                name: inputsValue.name,
                surname: inputsValue.surname,
                email: inputsValue.email,
                phone_number: inputsValue.phone,
                message: inputsValue.message
            }
        },
        onCompleted: () => {
            setLoading(false)
            resetRequestStatus()
            toast.success("Your Request Has Been Received Correctly 😃")
        },
        onError: (error) => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    useEffect(() => {
        let OK = true
        for(const value of Object.values(approved)){
            if(!value){
                OK = false
                break
            }
        }
        setDisabled(!OK)
    }, [approved])

    const resetRequestStatus = () => {
        setInputsValue({
            name: "",
            surname: "",
            email: "",
            phone: "",
            message: ""
        })
        setErrors({
            name: "",
            surname: "",
            email: "",
            phone: "",
            message: ""
        })
        setApproved({
            name: false,
            surname: false,
            email: false,
            phone: false,
            message: false
        })
    }

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputsValue({...inputsValue, name: newValue})
        if(newValue.length > 2 && newValue.length < 25){
            setApproved({...approved, name: true})
            setErrors({...errors, name: ""})
        }else if(newValue.length >= 25){
            setApproved({...approved, name: false})
            setErrors({...errors, name: "Name too Long"})
        }else{
            setApproved({...approved, name: false})
            setErrors({...errors, name: "Name too Short"})
        }
    }
    const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputsValue({...inputsValue, surname: newValue})
        if(newValue.length > 2 && newValue.length < 25){
            setApproved({...approved, surname: true})
            setErrors({...errors, surname: ""})
        }else if(newValue.length >= 25){
            setApproved({...approved, surname: false})
            setErrors({...errors, surname: "Surname too Long"})
        }else{
            setApproved({...approved, surname: false})
            setErrors({...errors, surname: "Surname too Short"})
        }
    }
    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputsValue({...inputsValue, email: newValue})
        if(validator.isEmail(newValue)){
            setApproved({...approved, email: true})
            setErrors({...errors, email: ""})
        }else{
            setApproved({...approved, email: false})
            setErrors({...errors, email: "Email not Valid"})
        }
    }
    const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputsValue({...inputsValue, phone: newValue})
        if(validator.isMobilePhone(newValue)){
            setApproved({...approved, phone: true})
            setErrors({...errors, phone: ""})
        }else{
            setApproved({...approved, phone: false})
            setErrors({...errors, phone: "Phone not Valid"})
        }
    }
    const onChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setInputsValue({...inputsValue, message: newValue})
        if(newValue.length > 50 && newValue.length < 500){
            setApproved({...approved, message: true})
            setErrors({...errors, message: ""})
        }else if(newValue.length >= 500){
            setApproved({...approved, message: false})
            setErrors({...errors, message: "Message too Long"})
        }else{
            setApproved({...approved, message: false})
            setErrors({...errors, message: "Message too Short"})
        }
    }

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        CreateNewContactRequest()
    }

    return (
        <form onSubmit={(e) => onFormSubmit(e)} className="flex flex-col gap-8 items-center w-full h-full">
            <div className="flex xls:flex-row flex-col justify-between w-full gap-8">
                <div className="flex flex-col grow gap-2">
                    <div className={"flex flex-row justify-between items-center"}>
                        <label htmlFor="name">Name: <span className="text-red-600 text-lg">*</span></label>
                        <span className="text-red-600 text-sm">{errors.name}</span>
                    </div>
                    <input onChange={onChangeName} value={inputsValue.name} placeholder="Insert your name here..." id="name" type="text" className="border-[1px] border-neutral-400 p-3 text-lg rounded-lg"/>
                </div>
                <div className="flex flex-col grow gap-2">
                    <div className={"flex flex-row justify-between items-center"}>
                        <label htmlFor="surname">Surname: <span className="text-red-600 text-lg">*</span></label>
                        <span className="text-red-600 text-sm">{errors.surname}</span>
                    </div>
                    <input onChange={onChangeSurname} value={inputsValue.surname} placeholder="Insert your surname here..." id="surname" type="text" className="border-[1px] border-neutral-400 p-3 text-lg rounded-lg"/>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className={"flex flex-row justify-between items-center"}>
                    <label htmlFor="email">Email: <span className="text-red-600 text-lg">*</span></label>
                    <span className="text-red-600 text-sm">{errors.email}</span>
                </div>
                <input onChange={onChangeEmail} value={inputsValue.email} placeholder="Insert your email here..." id="email" type="email" className="border-[1px] border-neutral-400 p-3 text-lg rounded-lg"/>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className={"flex flex-row justify-between items-center"}>
                    <label htmlFor="phone">Phone: <span className="text-red-600 text-lg">*</span></label>
                    <span className="text-red-600 text-sm">{errors.phone}</span>
                </div>
                <input onChange={onChangePhone} value={inputsValue.phone} placeholder="Insert your phone here..." id="phone" type="tel" className="border-[1px] border-neutral-400 p-3 text-lg rounded-lg"/>
            </div>
            <div className="flex flex-col gap-2 w-full h-full">
                <div className={"flex flex-row justify-between items-center"}>
                    <label htmlFor="message">Message: <span className="text-red-600 text-lg">*</span></label>
                    <span className="text-red-600 text-sm">{errors.message}</span>
                </div>
                <textarea onChange={onChangeMessage} value={inputsValue.message} placeholder="Insert your message here..." rows={5} id="message" className="resize-none border-[1px] border-neutral-400 p-3 text-lg h-full rounded-lg"/>
            </div>
            <button disabled={disabled || loading} type="submit" className="flex items-center justify-center relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-700 hover:bg-green-500 cursor-pointer bg-green-standard w-full p-4  text-white font-semibold text-center text-lg shadow-lg rounded-lg">
                {
                    loading ?
                        <Bars height={24} color={"white"}/>
                        :
                        "Get In Touch"
                }
            </button>
        </form>
    );
};

export default Form;