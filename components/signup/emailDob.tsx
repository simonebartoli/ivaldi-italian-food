import React, {ChangeEvent, RefObject, useEffect, useRef, useState} from 'react';
import {moveLabel, revertLabel} from "../library/lableMover";
import validator from "validator";
import moment from "moment";
import {HiOutlineMail} from "react-icons/hi";
import {MdOutlineCake} from "react-icons/md";
import {gql, useLazyQuery} from "@apollo/client";

type Props = {
    email: string
    dob: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setDob: React.Dispatch<React.SetStateAction<string>>
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void
}

const CHECK_EXISTING_EMAIL = gql`
    query CHECK_EXISTING_EMAIL($email: String!) {
        checkExistingEmail(email: $email)
    }
`

const EmailDob = React.forwardRef<HTMLDivElement, Props>(({email, setEmail, dob, setDob, moveNext, moveBack}, ref) => {
    const MIN_DATE = moment().subtract("100", "years")
    const MAX_DATE = moment().subtract("18", "years")
    const [secondSectionButtonDisabled, setSecondSectionButtonDisabled] = useState(true)
    const [secondButtonErrors, setSecondButtonErrors] = useState({
        email: {
            status: false,
            message: ""
        },
        dob: {
            status: false,
            message: ""
        }
    })

    const [checkExistingEmail] = useLazyQuery(CHECK_EXISTING_EMAIL, {
        onError: (error) => {
            console.log(error.graphQLErrors)
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: {
                    status: false,
                    message: error.message
                }
            })
        },
        onCompleted: () => {
            console.log("CALL HERE")
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: {
                    status: true,
                    message: ""
                }
            })
            moveNext(1,2)
        }
    })

    const emailRef = useRef<HTMLDivElement>(null)
    const dobRef = useRef<HTMLDivElement>(null)

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.trim()
        if(newValue.length > 0) moveLabel(emailRef)
        setEmail(newValue)
        if(validator.isEmail(newValue)){
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setSecondButtonErrors({
                ...secondButtonErrors,
                email: {
                    status: false,
                    message: "Email is not valid"
                }
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
                dob: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setSecondButtonErrors({
                ...secondButtonErrors,
                dob: {
                    status: false,
                    message: "Date of Birth is not valid"
                }
            })
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, ref: RefObject<HTMLDivElement>, date: boolean) => {
        const newValue = e.target.value
        if(newValue === ""){
            revertLabel(ref)
            if(date) e.target.type = "text"
        }
    }

    useEffect(() => {
        let OK = true
        for(const value of Object.values(secondButtonErrors)){
            if(!value.status) OK = false
        }
        if(OK) setSecondSectionButtonDisabled(false)
        else setSecondSectionButtonDisabled(true)
    }, [secondButtonErrors])

    useEffect(() => {
        moveLabel(dobRef)
    }, [])

    return (
        <div ref={ref} className="hidden flex flex-col gap-16 items-center xls:w-1/3 mdx:w-1/2 sm:w-2/3 smxl:w-3/4 w-full">
            <span className="text-lg text-center">Now set an email and input your date of birth... <br/>then click Next</span>
            <div className="space-y-12 w-full">
                <div className="flex flex-col relative w-full">
                    <span className="absolute text-red-600 w-full text-right -top-7 left-0">{secondButtonErrors.email.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={emailRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <HiOutlineMail className="mt-[1px]"/>
                            <span className="font-navbar">Email</span>
                        </div>
                        <input
                            value={email} onChange={(e) => onEmailChange(e)}
                            onFocus={() => moveLabel(emailRef)}
                            onBlur={(e) => onInputBlur(e, emailRef, false)}
                            type="text"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
                <div className="flex flex-col relative w-full">
                    <span className="absolute text-red-600 w-full text-right -top-7 left-0">{secondButtonErrors.dob.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={dobRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <MdOutlineCake className="mt-[1px]"/>
                            <span className="font-navbar">Date Of Birth</span>
                        </div>
                        <input
                            min={MIN_DATE.format("YYYY-MM-DD")}
                            max={MAX_DATE.format("YYYY-MM-DD")}
                            value={dob} onChange={(e) => onDobChange(e)}
                            type="date"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between gap-4 w-full">
                <button onClick={() => moveBack(1, 0)} className="w-full p-4 text-center bg-red-600 rounded-lg text-white border-2 border-black shadow-lg basis-1/3">Back</button>
                <button
                    disabled={secondSectionButtonDisabled}
                    onClick={() => checkExistingEmail({
                        variables: {
                            email: email
                        }
                    })}
                    className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg basis-2/3">Next</button>
            </div>
        </div>
    );
});

EmailDob.displayName = "EmailDob"
export default EmailDob;