import React, {ChangeEvent, RefObject, useEffect, useRef, useState} from 'react';
import {AiOutlineUser} from "react-icons/ai";
import {moveLabel, revertLabel} from "../library/lableMover";

type Props = {
    name: string
    surname: string
    setName: React.Dispatch<React.SetStateAction<string>>
    setSurname: React.Dispatch<React.SetStateAction<string>>
    moveNext: (oldRef: number, newRef: number) => void
}

const NameSurname = React.forwardRef<HTMLDivElement, Props>(({name, surname, setName, setSurname, moveNext}, ref) => {
    const [firstSectionButtonDisabled, setFirstSectionButtonDisabled] = useState(true)
    const [firstButtonErrors, setFirstButtonErrors] = useState({
        name: {
            status: false,
            message: ""
        },
        surname: {
            status: false,
            message: ""
        }
    })
    const nameRef = useRef<HTMLDivElement>(null)
    const surnameRef = useRef<HTMLDivElement>(null)

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, ref: RefObject<HTMLDivElement>, date: boolean) => {
        const newValue = e.target.value
        if(newValue === ""){
            revertLabel(ref)
            if(date) e.target.type = "date"
        }
    }
    useEffect(() => {
        let OK = true
        for(const value of Object.values(firstButtonErrors)){
            if(!value.status) OK = false
        }
        if(OK) setFirstSectionButtonDisabled(false)
        else setFirstSectionButtonDisabled(true)
    }, [firstButtonErrors])

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setName(newValue)
        if(newValue.length > 2 && newValue.length < 25){
            setFirstButtonErrors({
                ...firstButtonErrors,
                name: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setFirstButtonErrors({
                ...firstButtonErrors,
                name: {
                    status: false,
                    message: "Name is not valid"
                }
            })
        }
    }
    const onSurnameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSurname(newValue)
        if(newValue.length > 2 && newValue.length < 25){
            setFirstButtonErrors({
                ...firstButtonErrors,
                surname: {
                    status: true,
                    message: ""
                }
            })
        }else{
            setFirstButtonErrors({
                ...firstButtonErrors,
                surname: {
                    status: false,
                    message: "Surname is not valid"
                }
            })
        }
    }

    return (
        <div ref={ref} className="flex flex-col gap-16 items-center xls:w-1/3 mdx:w-1/2 sm:w-2/3 smxl:w-3/4 w-full h-full p-2">
            <span className="text-lg text-center">Insert your name and surname and then click Next</span>
            <div className="space-y-12 w-full">
                <div className="flex flex-col w-full relative">
                    <span className="absolute text-red-600 w-full text-right -top-7 left-0">{firstButtonErrors.name.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={nameRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <AiOutlineUser className="mt-[1px]"/>
                            <span className="font-navbar">Name</span>
                        </div>
                        <input
                            value={name} onChange={(e) => onNameChange(e)}
                            onFocus={() => moveLabel(nameRef)}
                            onBlur={(e) => onInputBlur(e, nameRef, false)}
                            type="text"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
                <div className="flex flex-col relative w-full">
                    <span className="absolute text-red-600 w-full text-right -top-7 left-0">{firstButtonErrors.surname.message}</span>
                    <div className="flex flex-col relative w-full">
                        <div ref={surnameRef} className="pointer-events-none select-none transition-all absolute text-neutral-500 top-1/2 text-lg -translate-y-1/2 left-4 flex flex-row gap-2 items-center">
                            <AiOutlineUser className="mt-[1px]"/>
                            <span className="font-navbar">Surname</span>
                        </div>
                        <input
                            value={surname} onChange={(e) => onSurnameChange(e)}
                            onFocus={() => moveLabel(surnameRef)}
                            onBlur={(e) => onInputBlur(e, surnameRef, false)}
                            type="text"
                            className="border-[1px] border-neutral-400 text-lg p-3 w-full rounded-md"/>
                    </div>
                </div>
            </div>
            <button
                disabled={firstSectionButtonDisabled}
                onClick={() => moveNext(0, 1)}
                className="transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black w-full p-4 text-center bg-green-standard rounded-lg text-white border-2 border-black shadow-lg">Next</button>
        </div>
    );
});

NameSurname.displayName = "NameSurname"
export default NameSurname;