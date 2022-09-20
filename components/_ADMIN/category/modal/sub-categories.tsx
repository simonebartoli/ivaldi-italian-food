import React, {useState} from 'react';
import {MdSettingsBackupRestore} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";
import {CategoryServerType, CategoryType} from "../../../../pages/categories";
import {NextPage} from "next";

type Category = {name: string, removed: boolean}

type Props = {
    category: CategoryServerType
    currentProperty: {
        value: CategoryType
        set: React.Dispatch<React.SetStateAction<CategoryType>>
    }
}

const SubCategories: NextPage<Props> = ({category, currentProperty}) => {
    const [subCategories, setSubCategories] = useState<Category[]>(category.sub_categories.map((element) => {
        return {
            name: element.name,
            removed: false
        }
    }))
    const [newSubCategories, setNewSubCategories] = useState("")

    const checkIfSame = (newSubCategories: Category[]) => {
        const toTest = [...newSubCategories.filter((_) => !_.removed).map((_) => _.name)]
        return toTest.every((element) => category.sub_categories.map(_ => _.name).includes(element)) &&
            category.sub_categories.every((element) => toTest.includes(element.name))
    }

    const onKeywordRemove = (index: number) => {
        const newSubCategories = [...subCategories]
        newSubCategories[index].removed = true
        if(checkIfSame(newSubCategories)){
            currentProperty.set({
                ...currentProperty.value,
                sub_categories: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                sub_categories: [...newSubCategories.filter((_) => !_.removed).map((_) => {
                    return {
                        name: _.name
                    }
                })]
            })
        }
        setSubCategories(newSubCategories)
    }
    const onKeywordRestore = (index: number) => {
        const newSubCategories = [...subCategories]
        newSubCategories[index].removed = false
        if(checkIfSame(newSubCategories)){
            currentProperty.set({
                ...currentProperty.value,
                sub_categories: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                sub_categories: [...newSubCategories.filter((_) => !_.removed).map((_) => {
                    return {
                        name: _.name
                    }
                })]
            })
        }
        setSubCategories(newSubCategories)
    }
    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code === "Enter" && newSubCategories.length > 2){
            const existing = subCategories.find((element) => element.name.toLowerCase() === newSubCategories.toLowerCase())

            if(existing === undefined){
                const newKeywords = [
                    {
                        name: newSubCategories,
                        removed: false
                    },
                    ...subCategories
                ]
                if(checkIfSame(newKeywords)){
                    currentProperty.set({
                        ...currentProperty.value,
                        sub_categories: null
                    })
                }
                else{
                    currentProperty.set({
                        ...currentProperty.value,
                        sub_categories: [...newKeywords.filter((_) => !_.removed).map((_) => {
                            return {
                                name: _.name
                            }
                        })]
                    })
                }

                setSubCategories(newKeywords)
                setNewSubCategories("")
            }else{
                alert("Keyword Already Set.")
            }
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Add a Sub Category:</span>
                <input
                    value={newSubCategories}
                    onChange={(e) => setNewSubCategories(e.target.value)}
                    onKeyDown={(e) => addKeyword(e)}
                    placeholder={"Insert your subcategory... (press enter to confirm)"}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
            <div className="flex flex-col w-full gap-6 max-h-[400px] overflow-y-scroll">
                {subCategories.map((element, index) =>
                    <div style={{
                        color: element.removed ? "rgb(115 115 115)" : "black",
                        backgroundColor: element.removed ? "rgb(245 245 245)" : "transparent"
                    }}
                         key={index}
                         className="relative w-full flex flex-row justify-between gap-4 items-center smxl:text-xl text-base p-2 rounded-lg">

                        <span>{element.name}</span>
                        {
                            element.removed ?
                                <MdSettingsBackupRestore onClick={() => onKeywordRestore(index)} className={"transition cursor-pointer text-2xl hover:text-neutral-700"}/>
                                :
                                <IoMdTrash onClick={() => onKeywordRemove(index)} className="cursor-pointer text-2xl text-red-600 hover:text-red-500"/>
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

export default SubCategories;