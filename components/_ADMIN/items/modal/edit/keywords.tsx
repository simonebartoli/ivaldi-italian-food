import React, {useState} from 'react';
import {IoMdTrash} from "react-icons/io";
import {MdSettingsBackupRestore} from "react-icons/md"
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Keyword = {
    name: string
    removed: boolean
}

type Props = {
    item: {
        keywords: string[]
    },
    currentProperty: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

const Keywords: NextPage<Props> = ({item, currentProperty}) => {
    const [keywords, setKeywords] = useState<Keyword[]>(item.keywords.map((element) => {
        return {
            name: element,
            removed: false
        }
    }))
    const [newKeyword, setNewKeyword] = useState("")

    const checkIfSame = (newKeywords: Keyword[]) => {
        const toTest = [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
        return toTest.every((element) => item.keywords.includes(element)) && item.keywords.every((element) => toTest.includes(element))
    }

    const onKeywordRemove = (index: number) => {
        const newKeywords = [...keywords]
        newKeywords[index].removed = true
        if(checkIfSame(newKeywords)){
            currentProperty.set({
                ...currentProperty.value,
                keyword: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                keyword: [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
            })
        }
        setKeywords(newKeywords)
    }
    const onKeywordRestore = (index: number) => {
        const newKeywords = [...keywords]
        newKeywords[index].removed = false
        if(checkIfSame(newKeywords)){
            currentProperty.set({
                ...currentProperty.value,
                keyword: null
            })
        }else{
            currentProperty.set({
                ...currentProperty.value,
                keyword: [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
            })
        }
        setKeywords(newKeywords)
    }
    const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code === "Enter" && newKeyword.length > 2){
            const existing = keywords.find((element) => element.name.toLowerCase() === newKeyword.toLowerCase())

            if(existing === undefined){
                const newKeywords = [
                    {
                        name: newKeyword,
                        removed: false
                    },
                    ...keywords
                ]
                if(checkIfSame(newKeywords)){
                    currentProperty.set({
                        ...currentProperty.value,
                        keyword: null
                    })
                }
                else{
                    currentProperty.set({
                        ...currentProperty.value,
                        keyword: [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
                    })
                }

                setKeywords(newKeywords)
                setNewKeyword("")
            }else{
                alert("Keyword Already Set.")
            }
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Add a Keyword:</span>
                <datalist id={"test"}>
                    <option value="">test1</option>
                    <option value="">test2</option>
                    <option value="">test3</option>
                </datalist>
                <input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => addKeyword(e)}
                    list={"test"}
                    placeholder={"Insert your keyword here... (press enter to confirm)"}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
            <div className="flex flex-col w-full gap-6 max-h-[400px] overflow-y-scroll">
                {keywords.map((element, index) =>
                    <div style={{
                        color: element.removed ? "rgb(115 115 115)" : "black",
                        backgroundColor: element.removed ? "rgb(245 245 245)" : "transparent"
                    }}
                         key={index}
                         className="relative w-full flex flex-row justify-between items-center text-xl p-2 rounded-lg">

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

export default Keywords;