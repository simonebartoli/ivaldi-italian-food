import React, {useState} from 'react';
import {MdSettingsBackupRestore} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";
import {gql, useQuery} from "@apollo/client";

type Keyword = {
    name: string
    removed: boolean
}
type Props = {
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

type GetKeywordsType = {
    getKeywords: string[]
}
const GET_KEYWORDS = gql`
    query GET_KEYWORDS {
        getKeywords
    }
`

const Keyword: NextPage<Props> = ({product}) => {
    const [keywords, setKeywords] = useState<Keyword[]>([])
    const [newKeyword, setNewKeyword] = useState("")
    const [datalist, setDatalist] = useState<string[]>([])

    const onKeywordRemove = (index: number) => {
        const newKeywords = [...keywords]
        newKeywords[index].removed = true
        const lengthKeyword = newKeywords.filter((_) => !_.removed).length

        product.set({
            ...product.value,
            keyword: lengthKeyword > 0 ? [...newKeywords.filter((_) => !_.removed).map((_) => _.name)] : null
        })

        setKeywords(newKeywords)
    }
    const onKeywordRestore = (index: number) => {
        const newKeywords = [...keywords]
        newKeywords[index].removed = false
        product.set({
            ...product.value,
            keyword: [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
        })

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
                product.set({
                    ...product.value,
                    keyword: [...newKeywords.filter((_) => !_.removed).map((_) => _.name)]
                })

                setKeywords(newKeywords)
                setNewKeyword("")
            }else{
                alert("Keyword Already Set.")
            }
        }
    }

    const {} = useQuery<GetKeywordsType>(GET_KEYWORDS, {
        onCompleted: (data) => {
            setDatalist(data.getKeywords)
        }
    })

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Add a Keyword:</span>
                <datalist id={"keywords"}>
                    {
                        datalist.map((_, index) =>
                            <option key={index} value={_}>{_}</option>
                        )
                    }
                </datalist>
                <input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => addKeyword(e)}
                    list={"keywords"}
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

export default Keyword;