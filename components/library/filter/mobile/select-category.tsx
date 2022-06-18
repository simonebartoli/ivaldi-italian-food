import React, {useRef, useState} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {categories, categoryType} from "../../../../test-data/categories";
import {IoMdArrowDropdown} from "react-icons/io";
import {BsPlus} from "react-icons/bs";
import {NextPage} from "next";
import {AiOutlinePlusCircle} from "react-icons/ai";

const SelectCategory = () => {
    const categoriesRef = useRef<HTMLDivElement>(null)
    const [optionSelected, setOptionSelected] = useState("Most Relevant")

    const handleContextMenuClick = () => {
        if(categoriesRef.current !== null){
            categoriesRef.current.classList.toggle("hidden")
        }
    }

    return (
        <div className="border-b-[1px] border-neutral-300 flex smx:text-xl text-lg w-full flex-col justify-center items-center">
            <div onClick={handleContextMenuClick} className="p-6 flex flex-row justify-between items-center w-full hover:bg-neutral-100">
                <span>Select Category: </span>
                <div className="flex flex-row items-center justify-center gap-4">
                    <span className="font-semibold underline underline-offset-8">{optionSelected}</span>
                    <BiArrowToBottom/>
                </div>
            </div>
            <div ref={categoriesRef} className="hidden flex flex-col items-center w-full bg-neutral-100">
                {
                    categories.map((element, index) => {
                        return (
                            <Element key={index} element={element}
                                     setOptionSelected={setOptionSelected}
                                     categoriesRef={categoriesRef}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};


type PropsElement = {
    element: categoryType
    setOptionSelected: React.Dispatch<React.SetStateAction<string>>
    categoriesRef: React.RefObject<HTMLDivElement>
}
const Element: NextPage<PropsElement> = ({element, setOptionSelected, categoriesRef}) => {
    const subRef = useRef<HTMLDivElement>(null)
    const handleClickCategory = () => {
        if(subRef.current !== null){
            subRef.current.classList.toggle("hidden")
        }
    }

    const handleOptionClick = (id: string) => {
        setOptionSelected(id)
        if(subRef.current !== null && categoriesRef.current !== null){
            subRef.current.classList.toggle("hidden")
            categoriesRef.current.classList.toggle("hidden")
        }
    }

    return (
        <>
            <div onClick={handleClickCategory} className="w-full p-6 border-t-[1px] border-neutral-200 hover:bg-neutral-200 flex flex-row justify-between items-center gap-4">
                <div className="items-center justify-center flex flex-row gap-4">
                    <span>{element.name}</span>
                    {element.sub.length > 0 && <IoMdArrowDropdown/>}
                </div>
                <AiOutlinePlusCircle onClick={() => handleOptionClick(element.name)} className="text-2xl"/>
            </div>
            <div ref={subRef} className="hidden w-full">
                {
                    element.sub.map((elementSub, indexJ) =>
                        <div onClick={() => handleOptionClick(elementSub)} key={indexJ} className="flex w-full bg-neutral-200 p-6 border-t-[1px] border-neutral-300 hover:bg-neutral-300 flex-row justify-center items-center gap-4">
                            <span>{elementSub}</span>
                            <BsPlus/>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default SelectCategory;