import React, {useEffect, useState} from 'react';
import validator from "validator";

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

    return (
        <form className="flex flex-col gap-8 items-center w-full h-full">
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
            <div className="bg-green-standard button-animated hover:before:w-full before:bg-[#008c2e] w-full">
                <input disabled={disabled} type="submit" value="Get in Touch" className="relative z-10 transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black cursor-pointer w-full p-4  text-white font-semibold text-center text-lg border-2 border-black shadow-lg"/>
            </div>
        </form>
    );
};

export default Form;