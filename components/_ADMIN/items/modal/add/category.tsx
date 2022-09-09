import React, {ChangeEvent, useState} from 'react';
import {MdSettingsBackupRestore} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";
import {gql, useQuery} from "@apollo/client";
import PageLoader from "../../../../page-loader";
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";


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
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

const Category: NextPage<Props> = ({product}) => {
    const [categories, setCategories] = useState<{name: string, removed: boolean}[]>([])
    const [categoriesExisting, setCategoriesExisting] = useState<string[]>([])

    const onCategoryRemove = (index: number) => {
        const newCategory = [...categories]
        newCategory[index].removed = true
        const lengthCategory = newCategory.filter((_) => !_.removed).length

        product.set({
            ...product.value,
            category: lengthCategory > 0 ? [...newCategory.filter((_ => !_.removed)).map((_) => _.name)] : null
        })

        setCategories(newCategory)
    }
    const onCategoryRestore = (index: number) => {
        const newCategory = [...categories]
        newCategory[index].removed = false
        product.set({
            ...product.value,
            category: [...newCategory.filter((_ => !_.removed)).map((_) => _.name)]
        })

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
                if(product.value["category"] !== null){
                    product.set({
                        ...product.value,
                        category: [...product.value["category"], newValue]
                    })
                }else{
                    product.set({
                        ...product.value,
                        category: [newValue]
                    })
                }
                setCategories([...categories, {name: newValue, removed: false}])
            }else{
                alert("Category Already Set")
            }
        }
    }

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