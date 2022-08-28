import React, {useEffect, useRef, useState} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {IoMdArrowDropdown} from "react-icons/io";
import {BsPlus} from "react-icons/bs";
import {NextPage} from "next";
import {AiOutlinePlusCircle} from "react-icons/ai";
import {useRouter} from "next/router";
import {gql, useQuery} from "@apollo/client";

type Category = {
    name: string
    sub_categories?: {
        name: string
    }[]
}
type GetCategoriesFull = {
    getCategories_FULL: Category[]
}

const GET_CATEGORIES_FULL = gql`
    query GET_CATEGORIES_FULL {
        getCategories_FULL {
            name
            sub_categories {
                name
            }
        }
    }
`

const SelectCategory = () => {
    const categoriesRef = useRef<HTMLDivElement>(null)
    const [categorySelected, setCategorySelected] = useState("Relevant")
    const firstRender = useRef(true)
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([{
        name: "Relevant"
    }])
    const [categoriesNoSub, setCategoriesNoSub] = useState<Category["sub_categories"]>([])


    const {} = useQuery<GetCategoriesFull>(GET_CATEGORIES_FULL, {
        onCompleted: (data) => {
            setCategories([...categories, ...data.getCategories_FULL])
        }
    })

    const handleContextMenuClick = () => {
        if(categoriesRef.current !== null){
            categoriesRef.current.classList.toggle("hidden")
        }
    }

    useEffect(() => {
        if(firstRender.current) firstRender.current = false
        else {
            if(categorySelected !== "Relevant"){
                router.push("/search?query=" + categorySelected)
            }else if(categorySelected === "Relevant"){
                router.push("/shop")
            }
        }
    }, [categorySelected])

    useEffect(() => {
        if(categories.length > 1){
            const {query} = router.query
            if(query !== undefined && !Array.isArray(query)){
                for(const cat of categories){
                    if(cat.name === query){
                        setCategorySelected(query)
                        break
                    }
                    if(cat.sub_categories) {
                        for (const sub of cat.sub_categories) {
                            if (sub.name === query) {
                                setCategorySelected(query)
                                break
                            }
                        }
                    }
                }
            }
        }
    }, [categories])

    return (
        <div className="border-b-[1px] border-neutral-300 flex smx:text-xl text-lg w-full flex-col justify-center items-center">
            <div onClick={handleContextMenuClick} className="p-6 flex flex-row justify-between items-center w-full hover:bg-neutral-100">
                <span>Select Category: </span>
                <div className="flex flex-row items-center justify-center gap-4">
                    <span className="font-semibold underline underline-offset-8">{categorySelected}</span>
                    <BiArrowToBottom/>
                </div>
            </div>
            <div ref={categoriesRef} className="hidden flex flex-col items-center w-full bg-neutral-100">
                {
                    categories.map((element, index) => {
                        return (
                            <Element key={index} element={element}
                                     setOptionSelected={setCategorySelected}
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
    element: Category
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
                    {element.sub_categories  && <IoMdArrowDropdown/>}
                </div>
                <AiOutlinePlusCircle onClick={() => handleOptionClick(element.name)} className="text-2xl"/>
            </div>
            <div ref={subRef} className="hidden w-full">
                {
                    element.sub_categories &&
                    element.sub_categories.map((elementSub, indexJ) =>
                        <div onClick={() => handleOptionClick(elementSub.name)} key={indexJ} className="flex w-full bg-neutral-200 p-6 border-t-[1px] border-neutral-300 hover:bg-neutral-300 flex-row justify-center items-center gap-4">
                            <span>{elementSub.name}</span>
                            <BsPlus/>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default SelectCategory;