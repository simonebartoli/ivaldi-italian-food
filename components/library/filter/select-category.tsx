import React, {useEffect, useRef, useState} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {IoMdArrowDropright} from "react-icons/io";

const categories = [
    {
        name: "Pasta",
        sub: ["Spaghetti", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Sauces",
        sub: ["Spaghetti2", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Meat",
        sub: ["Spaghetti3", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Fish",
        sub: ["Spaghetti4", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Cheese",
        sub: ["Spaghetti5", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Charcuterie",
        sub: ["Spaghetti6", "Penne", "Riso", "Farina", "Pizza", "Impasto"]
    },
    {
        name: "Biscuits",
        sub: ["Spaghetti7", "Penne", "Riso", "Farina", "Pizza", "Impasto", "test2"]
    },
    {
        name: "TEST CLICKABLE",
        sub: []
    },
]

const SelectCategory = () => {
    const [categorySelected, setCategorySelected] = useState("Relevant")

    const [categoryHover, setCategoryHover] = useState<string>("")
    const [categorySelectedIndex, setCategorySelectedIndex] = useState<undefined | number>(undefined)
    const [subElements, setSubElements] = useState<string[]>([])

    const contextMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(categoryHover !== ""){
            const index = categories.findIndex((el) => el.name === categoryHover)
            setCategorySelectedIndex(index)
            setSubElements(categories[index].sub)
        }
    }, [categoryHover])

    const handleMouseEnter = (name: string) => {
        setCategoryHover(name)        
    }
    const handleClickCategory = (name: string) => {
        setCategorySelected(name)
    }

    const handleContextMenuClick = () => {
        setCategoryHover("")
        setCategorySelectedIndex(undefined)
        setSubElements([])
        if(contextMenuRef.current !== null){
            contextMenuRef.current.classList.toggle("animate-slideUp")
            contextMenuRef.current.classList.toggle("animate-slideDown")
            if(contextMenuRef.current.classList.contains("hidden")) {
                contextMenuRef.current.classList.toggle("hidden")
                setTimeout(() => contextMenuRef.current!.classList.toggle("pointer-events-none"), 250)
            }
            else {
                contextMenuRef.current.classList.toggle("pointer-events-none")
                setTimeout(() => contextMenuRef.current!.classList.toggle("hidden"), 250)
            }
        }
    }

    return (
        <div onClick={handleContextMenuClick} className="relative cursor-pointer xls:flex hidden basis-1/4 flex-row gap-4 items-center text-xl p-3 justify-center border-[1px] border-neutral-400 bg-white rounded-lg">
            <span>Select Category:</span>
            <span className="font-semibold">{categorySelected}</span>
            <BiArrowToBottom/>
            <div ref={contextMenuRef} className="hidden animate-slideUp pointer-events-none mt-4 border-[1px] rounded-b-lg border-neutral-500 bg-white absolute top-full left-0 flex-col items-center w-full shadow-lg">
                {
                    categories.map((element, index) =>
                        <div
                            style={{backgroundColor: `${categorySelectedIndex === index ? "rgb(245,245,245)" : "inherit"}`}}
                            onMouseEnter={() => handleMouseEnter(element.name)}
                            onClick={() => handleClickCategory(element.name)}
                            key={index}
                            className="group flex flex-row justify-between items-center w-full p-4 hover:bg-neutral-100">
                                <span>{element.name}</span>
                                {
                                    element.sub.length > 0 && <IoMdArrowDropright
                                        style={{color: `${categorySelectedIndex === index ? "black" : "rgb(163 163 163)"}`}}
                                        className="text-2xl text-neutral-400 group-hover:text-black transition"
                                    />
                                }
                        </div>
                    )
                }
            </div>
            <div className="grid grid-rows-5 grid-flow-col mt-4 ml-4 border-[1px] rounded-b-lg border-neutral-500 bg-white absolute top-full left-full items-center w-max shadow-lg">
                {
                    subElements.map((element, index) =>
                        <span
                            onClick={() => handleClickCategory(element)}
                            key={index}
                            className="border-[1px] border-neutral-200 w-full p-6 hover:bg-neutral-100">
                            {element}
                        </span>
                    )
                }
            </div>
        </div>
    );
};

export default SelectCategory;