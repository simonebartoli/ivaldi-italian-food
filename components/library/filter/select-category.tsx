import React, {useEffect, useRef, useState} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {gql, useQuery} from "@apollo/client";
import {useResizer} from "../../../contexts/resizer-context";
import {useLayoutContext} from "../../../contexts/layout-context";
import {useRouter} from "next/router";

type Category = {
    name: string
    sub_categories: {
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
    const router = useRouter()

    const [query, setQuery] = useState<string | string[] | undefined>(router.query.query)
    const [categories, setCategories] = useState<Category[]>([{
        name: "Relevant",
        sub_categories: []
    }])
    const [categoriesNoSub, setCategoriesNoSub] = useState<Category["sub_categories"]>([])
    const [categorySelected, setCategorySelected] = useState("")
    const contextMenuRef = useRef<HTMLDivElement>(null)

    const {widthPage, heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()


    const {} = useQuery<GetCategoriesFull>(GET_CATEGORIES_FULL, {
        onCompleted: (data) => {
            setCategories([...categories, ...data.getCategories_FULL])
        }
    })

    useEffect(() => {
        if(contextMenuRef.current !== null && navHeight !== undefined && searchBarHeight !== undefined){
            contextMenuRef.current.style.maxWidth = `${widthPage - 64}px`
            contextMenuRef.current.style.maxHeight = `${(heightPage - navHeight - searchBarHeight)}px`
        }
    }, [widthPage, navHeight, searchBarHeight])
    useEffect(() => {
        setCategorySelected("Relevant")

        const newCategories: Category["sub_categories"] = []
        for(const category of categories){
            if(category.sub_categories.length === 0) {
                newCategories.push({name: category.name})
            }
        }
        setCategoriesNoSub(newCategories.sort((a, b) => (a.name === "Relevant") ? -1 : (b.name === "Relevant") ? 1 : (a.name > b.name ? 1 : -1)))
    }, [categories])
    useEffect(() => {
        if(query !== undefined && !Array.isArray(query)){
            let found = false
            for(const cat of categories){
                if(cat.name === query){
                    setCategorySelected(query)
                    found = true
                    break
                }
                for(const sub of cat.sub_categories){
                    if(sub.name === query){
                        setCategorySelected(query)
                        found = true
                        break
                    }
                }
            }
            for(const cat of categoriesNoSub){
                if(cat.name === query){
                    found = true
                    setCategorySelected(query)
                    break
                }
            }
        }
    }, [categories, categoriesNoSub, query])

    const handleClickCategory = (name: string) => {
        setCategorySelected(name)
        if(name !== "Relevant"){
            router.push("/search?query=" + name)
        }else if(name === "Relevant"){
            router.push("/shop")
        }
    }
    const handleContextMenuClick = () => {
        if(contextMenuRef.current !== null){
            contextMenuRef.current.classList.toggle("animate-slideUp")
            contextMenuRef.current.classList.toggle("animate-slideDown")
            if(contextMenuRef.current.classList.contains("hidden")) {
                contextMenuRef.current.classList.toggle("hidden")
                setTimeout(() => {
                    if(contextMenuRef.current !== null) contextMenuRef.current.classList.toggle("pointer-events-none")
                }, 250)
            }
            else {
                contextMenuRef.current.classList.toggle("pointer-events-none")
                setTimeout(() => {
                    if(contextMenuRef.current !== null) contextMenuRef.current!.classList.toggle("hidden")
                }, 250)
            }
        }
    }



    return (
        <div onClick={handleContextMenuClick} className="relative cursor-pointer xls:flex hidden basis-1/4 flex-row gap-4 items-center text-xl p-3 justify-center border-[1px] border-neutral-400 bg-white rounded-lg">
            <span>Select Category:</span>
            <span className="font-semibold">{categorySelected}</span>
            <BiArrowToBottom/>
            <div ref={contextMenuRef} className="hidden animate-slideUp pointer-events-none p-4 flex flex-col gap-10 overflow-y-scroll h-max w-max box-border mt-4 border-[1px] border-t-4 border-t-green-standard rounded-b-lg border-neutral-500 bg-white absolute top-full left-0 items-start w-full shadow-lg">
                <div className="w-full grid grid-cols-4 grid-flow-row gap-x-16 gap-y-4">
                    {
                        categoriesNoSub.map((element) =>
                            <div onClick={() => handleClickCategory(element.name)} key={element.name} className="flex flex-col w-fit gap-6 items-start justify-start p-8">
                                <span className="text-2xl w-full font-semibold pb-4 border-b-[1px] border-neutral-500">{element.name}</span>
                            </div>
                        )
                    }
                </div>
                <span className="w-full border-t-[1px] border-neutral-500"/>
                <div className="w-full grid grid-cols-4 auto-rows-min grid-flow-row gap-x-16 gap-y-4">
                    {
                        categories.sort((a, b) => a > b ? 1 : -1).map((element) => {
                            if(element.sub_categories.length > 0){
                                return (
                                    <div key={element.name} className="flex flex-col w-fit gap-6 items-start justify-start p-8">
                                        <span onClick={() => handleClickCategory(element.name)} className="text-2xl w-full font-semibold pb-4 border-b-[1px] border-neutral-500">{element.name}</span>
                                        <div className="grid grid-flow-col grid-rows-6 gap-10 gap-x-24">
                                            {
                                                element.sub_categories.map((subElement) =>
                                                    <span onClick={() => handleClickCategory(subElement.name)} key={subElement.name} className="text-base hover:underline border-black">{subElement.name}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default SelectCategory;