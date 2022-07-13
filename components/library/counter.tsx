import React from 'react';
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
import {NextPage} from "next";

type Props = {
    max: number
    min: number
    itemNumber: number
    setItemNumber: React.Dispatch<React.SetStateAction<number>>
    options?: {
        sizeIcons?: string
        fontText?: string
        gap?: string
    }
}

const Counter: NextPage<Props> = ({max, min, itemNumber, setItemNumber, options}) => {

    const changeItemNumber = (action: string) => {
        if(action === "increase"){
            if(itemNumber < max){
                setItemNumber(itemNumber+1)
            }
        }else{
            if(itemNumber > min){
                setItemNumber(itemNumber-1)
            }
        }
    }

    return (
        <div className={`h-full w-full ${options?.gap !== undefined ? options.gap : "gap-4"} rounded-md flex flex-row items-center justify-between bg-neutral-100 border-[1px] border-black`}>
            <div className={`${itemNumber === min ? "cursor-not-allowed text-gray-800 bg-neutral-500" : "cursor-pointer text-black bg-neutral-300"} h-full group rounded-l-md border-r-black border-[1px] flex items-center p-2`}
                 onClick={() => changeItemNumber("decrease")}>
                <AiOutlineMinus
                    className={`${itemNumber === min ? "cursor-not-allowed pointer-events-none" : "group-hover:text-red-600 cursor-pointer"} transition ${options?.sizeIcons !== undefined ? options.sizeIcons : "text-3xl"}`}
                />
            </div>
            <div className={`${options?.fontText !== undefined ? options.fontText : "text-4xl"} select-none`}>
                <span>{itemNumber}</span>
            </div>
            <div className={`${itemNumber === max ? "cursor-not-allowed text-gray-800 bg-neutral-500" : "cursor-pointer text-black bg-neutral-300"} group rounded-r-md border-l-black border-[1px] h-full flex items-center p-2`}
                 onClick={() => changeItemNumber("increase")}>
                <AiOutlinePlus
                    className={`${itemNumber === max ? "cursor-not-allowed pointer-events-none" : "group-hover:text-green-standard cursor-pointer"} transition ${options?.sizeIcons !== undefined ? options.sizeIcons : "text-3xl"}`}
                />
            </div>
        </div>
    );
};

export default Counter;