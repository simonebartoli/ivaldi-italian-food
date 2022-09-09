import React, {ChangeEvent, useEffect, useState} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";
import {gql, useQuery} from "@apollo/client";
import PageLoader from "../../../../page-loader";
import {MdSettingsBackupRestore} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";

type SubCategoryType = {
    sub_category_id: string
    name: string
}
type CategoryType = {
    category_id: string
    name: string
    sub_categories: SubCategoryType[]
}
type GetCategoriesType = {
    getCategories_FULL: CategoryType[]
}
const GET_CATEGORIES = gql`
    query GET_CATEGORIES {
        getCategories_FULL {
            category_id
            name
            sub_categories {
                sub_category_id
                name
            }
        }
    }
`

type Props = {
    item: {
        category: string[]
    },
    currentProperty: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    },
    invalid: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
}

const Category: NextPage<Props> = ({item, currentProperty, invalid}) => {
    const [categories, setCategories] = useState<{name: string, removed: boolean}[]>(item.category.map((element) => {
        return {
            name: element,
            removed: false
        }
    }))
    const [categoriesExisting, setCategoriesExisting] = useState<string[]>([])


    const checkIfSame = (newKeywords: {name: string, removed: boolean}[]) => {
        const toTest = [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
        return toTest.every((element) => item.category.includes(element)) && item.category.every((element) => toTest.includes(element))
    }
    const onCategoryRemove = (index: number) => {
        const newCategory = [...categories]
        newCategory[index].removed = true
        if(checkIfSame(newCategory)){
            currentProperty.set({
                ...currentProperty.value,
                category: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                category: [...newCategory.filter((_ => !_.removed)).map((_) => _.name)]
            })
        }
        setCategories(newCategory)
    }
    const onCategoryRestore = (index: number) => {
        const newCategory = [...categories]
        newCategory[index].removed = false
        if(checkIfSame(newCategory)){
            currentProperty.set({
                ...currentProperty.value,
                category: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                category: [...newCategory.filter((_ => !_.removed)).map((_) => _.name)]
            })
        }
        setCategories(newCategory)
    }

    const {loading} = useQuery<GetCategoriesType>(GET_CATEGORIES, {
        onCompleted: (data) => {
            const newCategories: string[] = []

            for(const category of data.getCategories_FULL){
                newCategories.push(category.name)
                for(const sub of category.sub_categories){
                    newCategories.push(sub.name)
                }
            }

            setCategoriesExisting(newCategories)
        }
    })
    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        if(newValue !== ""){
            if(!(categories.map((_) => _.name)).includes(newValue)){
                if(currentProperty.value["category"] !== null){
                    currentProperty.set({
                        ...currentProperty.value,
                        category: [...currentProperty.value["category"], newValue]
                    })
                }else{
                    currentProperty.set({
                        ...currentProperty.value,
                        category: [newValue]
                    })
                }
                setCategories([...categories, {name: newValue, removed: false}])
            }else{
                alert("Category Already Set")
            }
        }
    }

    useEffect(() => {
        if(categories.every((element) => element.removed)) {
            invalid.set(true)
        }else{
            invalid.set(false)
        }
    }, [categories])

    if(loading) return <PageLoader display/>

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Category: </span>
                <select value="" onChange={(e) => handleCategoryChange(e)} className="w-full text-lg p-3 rounded-lg">
                    <option value="" selected>Select a Category...</option>
                    {
                        categoriesExisting.map((element) =>
                            <option key={element} value={element}>{element}</option>
                        )
                    }
                </select>
            </div>
            <div className="flex flex-col w-full gap-6 max-h-[400px] overflow-y-scroll">
                {categories.map((element, index) =>
                    <div style={{
                        color: element.removed ? "rgb(115 115 115)" : "black",
                        backgroundColor: element.removed ? "rgb(245 245 245)" : "transparent"
                    }}
                         key={index}
                         className="relative w-full flex flex-row justify-between items-center text-xl p-2 rounded-lg">

                        <span>{element.name}</span>
                        {
                            element.removed ?
                                <MdSettingsBackupRestore onClick={() => onCategoryRestore(index)} className={"transition cursor-pointer text-2xl hover:text-neutral-700"}/>
                                :
                                <IoMdTrash onClick={() => onCategoryRemove(index)} className="cursor-pointer text-2xl text-red-600 hover:text-red-500"/>
                        }
                        {
                            element.removed && <span className="absolute top-1/2 left-0 w-full -translate-y-1/2 border-t-[1px] border-neutral-500"/>
                        }

                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;