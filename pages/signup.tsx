import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import {HiOutlineMail} from "react-icons/hi";
import {AiOutlineUser} from "react-icons/ai";
import {BiLockAlt} from "react-icons/bi";
import {MdOutlineCake} from "react-icons/md";
import {moveLabel, revertLabel} from "../components/library/lableMover";
import moment from "moment";
import validator from "validator";

const Signup = () => {
    const MIN_DATE = moment().subtract("100", "years")
    const MAX_DATE = moment().subtract("18", "years")

    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const firstSectionRef = useRef<HTMLDivElement>(null)
    const secondSectionRef = useRef<HTMLDivElement>(null)
    const thirdSectionRef = useRef<HTMLDivElement>(null)

    const [firstSectionButtonDisabled, setFirstSectionButtonDisabled] = useState(true)
    const [firstButtonErrors, setFirstButtonErrors] = useState({
        name: false,
        surname: false
    })

    const [secondSectionButtonDisabled, setSecondSectionButtonDisabled] = useState(true)
    const [secondButtonErrors, setSecondButtonErrors] = useState({
        email: false,
        dob: false
    })

    const [thirdSectionButtonDisabled, setThirdSectionButtonDisabled] = useState(true)
    const [thirdButtonErrors, setThirdButtonErrors] = useState({
        password: false,
        confirmPassword: false
    })

    const nameRef = useRef<HTMLDivElement>(null)
    const [name, setName] = useState("")

    const surnameRef = useRef<HTMLDivElement>(null)
    const [surname, setSurname] = useState("")

    const emailRef = useRef<HTMLDivElement>(null)
    const [email, setEmail] = useState("")

    const dobRef = useRef<HTMLDivElement>(null)
    const [dob, setDob] = useState("")

    const passwordRef = useRef<HTMLDivElement>(null)
    const [password, setPassword] = useState("")
    const firstReqRef = useRef<HTMLLIElement>(null)
    const secondReqRef = useRef<HTMLLIElement>(null)

    const confirmPasswordRef = useRef<HTMLDivElement>(null)
    const [confirmPassword, setConfirmPassword] = useState("")


    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])
    useEffect(() => {
        let OK = true
        for(const value of Object.values(firstButtonErrors)){
            if(!value) OK = false
        }
        if(OK) setFirstSectionButtonDisabled(false)
        else setFirstSectionButtonDisabled(true)
    }, [firstButtonErrors])
    useEffect(() => {
        let OK = true
        for(const value of Object.values(secondButtonErrors)){
            if(!value) OK = false
        }
        if(OK) setSecondSectionButtonDisabled(false)
        else setSecondSectionButtonDisabled(true)
    }, [secondButtonErrors])
    useEffect(() => {
        let OK = true
        for(const value of Object.values(thirdButtonErrors)){
            if(!value) OK = false
        }
        if(OK) setThirdSectionButtonDisabled(false)
        else setThirdSectionButtonDisabled(true)
    }, [thirdButtonErrors])

    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>, inputName: string) => {
        switch (inputName){
            case "name":
                moveLabel(nameRef)
                break
            case "surname":
                moveLabel(surnameRef)
                break
            case "email":
                moveLabel(emailRef)
                break
            case "dob":
                moveLabel(dobRef)
                e.currentTarget.type = "date"
                break
            case "password":
                moveLabel(passwordRef)
                break
            case "confirmPassword":
                moveLabel(confirmPasswordRef)
                break
        }
    }
    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, inputName: string) => {
        const newValue = e.target.value
        if(newValue === ""){
            switch (inputName){
                case "name":
                    revertLabel(nameRef)
                    break
                case "surname":
                    revertLabel(surnameRef)
                    break
                case "email":
                    revertLabel(emailRef)
                    break
                case "dob":
                    revertLabel(dobRef)
                    e.currentTarget.type = "text"
                    break
                case "password":
                    revertLabel(passwordRef)
                    break
                case "confirmPassword":
                    revertLabel(confirmPasswordRef)
                    break
            }
        }
    }


    const moveNext = (oldRef: React.RefObject<HTMLDivElement>, newRef: React.RefObject<HTMLDivElement>) => {
        if(oldRef.current !== null && newRef.current !== null){
            oldRef.current.classList.toggle("animate-slideLeft")
            newRef.current.classList.toggle("hidden")
            newRef.current.classList.toggle("animate-comeFromRight")
            setTimeout(() => {
                oldRef.current!.classList.toggle("hidden")
                oldRef.current!.classList.remove("animate-slideLeft")
                newRef.current!.classList.remove("hidden")
                newRef.current!.classList.remove("animate-comeFromRight")
            }, 500)
        }
    }
    const moveBack = (oldRef: React.RefObject<HTMLDivElement>, newRef: React.RefObject<HTMLDivElement>) => {
        if(oldRef.current !== null && newRef.current !== null){
            oldRef.current.classList.toggle("animate-slideRight")
            newRef.current.classList.toggle("hidden")
            newRef.current.classList.toggle("animate-comeFromLeft")
            setTimeout(() => {
                oldRef.current!.classList.toggle("hidden")
                oldRef.current!.classList.remove("animate-slideRight")
                newRef.current!.classList.remove("hidden")
                newRef.current!.classList.remove("animate-comeFromLeft")
            }, 500)
        }
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setName(newValue)
        if(newValue.length > 2 && newValue.length < 25){
            setFirstButtonErrors({
                ...firstButtonErrors,
                name: true
            })
        }else{
            setFirstButtonErrors({
                ...firstButtonErrors,
                name: false
            })
        }
    }
    const onSurnameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSurname(newValue)
        if(newValue.length > 2 && newValue.length < 25){
            setFirstButtonErrors({
                ...firstButtonErrors,
                surname: true
            })
        }else{
            setFirstButtonErrors({
                ...firstButtonErrors,
                surname: false
            })
        }
    }
    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setEmail(newValue)
        if(validator.isEmail(newValue)){
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: true
            })
        }else{
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: false
            })
        }
    }
    const onDobChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setDob(newValue)
        const converted = moment(newValue)
        if(converted > MIN_DATE && converted < MAX_DATE){
            setSecondButtonErrors({
                ...secondButtonErrors,
                dob: true
            })
        }else{
            setSecondButtonErrors({
                ...secondButtonErrors,
                dob: false
            })
        }
    }
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
                password: true
            })
        }
    }
    const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setConfirmPassword(newValue)
        if(newValue === password){
            setThirdButtonErrors({
                ...thirdButtonErrors,
                confirmPassword: true
            })
        }else{
            setThirdButtonErrors({
                ...thirdButtonErrors,
                confirmPassword: false
            })
        }
    }

    return (
        <main ref={fullPageRef} className="flex flex-col gap-16 items-center justify-center p-8">
            <h2 className="text-4xl">Signup</h2>
            <div className="transition-all flex flex-row overflow-x-hidden gap-12 items-center justify-center w-full">

                {/*FIRST SECTION*/}
                <div ref={firstSectionRef} className="flex flex-col gap-16 items-center w-1/3">
                    <span className="text-lg text-center">Insert your name and surname and then click Next</span>
                    <div className="space-y-12 w-full">
                        <div className="flex flex-col relative w-full">
                            <div ref={nameRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <AiOutlineUser className="mt-[1px]"/>
                                <span className="font-navbar">Name</span>
                            </div>
                            <input
                                value={name} onChange={(e) => onNameChange(e)}
                                onFocus={(e) => onInputFocus(e, "name")}
                                onBlur={(e) => onInputBlur(e, "name")}
                                type="text"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                        <div className="flex flex-col relative w-full">
                            <div ref={surnameRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <AiOutlineUser className="mt-[1px]"/>
                                <span className="font-navbar">Surname</span>
                            </div>
                            <input
                                value={surname} onChange={(e) => onSurnameChange(e)}
                                onFocus={(e) => onInputFocus(e, "surname")}
                                onBlur={(e) => onInputBlur(e, "surname")}
                                type="text"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                    </div>
                    <button
                        disabled={firstSectionButtonDisabled}
                        onClick={() => moveNext(firstSectionRef, secondSectionRef)}
                        className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg">Next</button>
                </div>

                {/*SECOND SECTION*/}
                <div ref={secondSectionRef} className="hidden flex flex-col gap-16 items-center w-1/3">
                    <span className="text-lg text-center">Now set an email and input your date of birth... <br/>then click Next</span>
                    <div className="space-y-12 w-full">
                        <div className="flex flex-col relative w-full">
                            <div ref={emailRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <HiOutlineMail className="mt-[1px]"/>
                                <span className="font-navbar">Email</span>
                            </div>
                            <input
                                value={email} onChange={(e) => onEmailChange(e)}
                                onFocus={(e) => onInputFocus(e, "email")}
                                onBlur={(e) => onInputBlur(e, "email")}
                                type="text"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                        <div className="flex flex-col relative w-full">
                            <div ref={dobRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <MdOutlineCake className="mt-[1px]"/>
                                <span className="font-navbar">Date Of Birth</span>
                            </div>
                            <input
                                min={MIN_DATE.format("YYYY-MM-DD")}
                                max={MAX_DATE.format("YYYY-MM-DD")}
                                value={dob} onChange={(e) => onDobChange(e)}
                                onFocus={(e) => onInputFocus(e, "dob")}
                                onBlur={(e) => onInputBlur(e, "dob")}
                                type="text"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-4 w-full">
                        <button onClick={() => moveBack(secondSectionRef, firstSectionRef)} className="w-full p-4 text-center bg-red-600 rounded-lg text-white border-2 border-black shadow-lg basis-1/3">Back</button>
                        <button
                            disabled={secondSectionButtonDisabled}
                            onClick={() => moveNext(secondSectionRef, thirdSectionRef)}
                            className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg basis-2/3">Next</button>
                    </div>
                </div>


                {/*THIRD SECTION*/}
                <div ref={thirdSectionRef} className="hidden flex flex-col gap-16 items-center w-1/3 pb-16">
                    <span className="text-lg text-center">To finish the registration choose a strong password and<br/> then click Sign Up</span>
                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col relative w-full">
                            <div ref={passwordRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <BiLockAlt className="mt-[1px]"/>
                                <span className="font-navbar">Password</span>
                            </div>
                            <input
                                value={password} onChange={(e) => onPasswordChange(e)}
                                onFocus={(e) => onInputFocus(e, "password")}
                                onBlur={(e) => onInputBlur(e, "password")}
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
                        <div className="flex flex-col relative w-full">
                            <div ref={confirmPasswordRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                                <BiLockAlt className="mt-[1px]"/>
                                <span className="font-navbar">Confirm Password</span>
                            </div>
                            <input
                                value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e)}
                                onFocus={(e) => onInputFocus(e, "confirmPassword")}
                                onBlur={(e) => onInputBlur(e, "confirmPassword")}
                                type="password"
                                className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-row justify-between gap-4">
                            <button onClick={() => moveBack(thirdSectionRef, secondSectionRef)} className="w-full p-4 text-center bg-red-600 rounded-lg text-white border-2 border-black shadow-lg basis-1/3">Back</button>
                            <button
                                disabled={thirdSectionButtonDisabled}
                                className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg basis-2/3">Sign Up</button>
                        </div>
                        <span className="text-right">* By Clicking &quot;Sign Up&quot; you accept our Terms & Conditions</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;