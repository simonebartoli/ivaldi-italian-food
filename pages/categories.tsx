import React, {useEffect, useRef, useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import {IoArrowDownCircle} from "react-icons/io5";
import {BiSubdirectoryRight} from "react-icons/bi";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";
import {useAuth} from "../contexts/auth-context";
import {BsFillTrashFill} from "react-icons/bs";
import {HiPencilAlt} from "react-icons/hi";
import EditForm from "../components/_ADMIN/category/modal/edit-form";
import {ApolloQueryResult, gql, OperationVariables, useQuery} from "@apollo/client";
import {NextPage} from "next";
import AddForm from "../components/_ADMIN/category/modal/add-form";
import RemoveForm from "../components/_ADMIN/category/modal/remove-form";

type CategoryType = {
    name: string | null
    sub_categories: {
        name: string
    }[] | null
}
type CategoryServerType = {
    category_id: string
    name: string
    sub_categories: {
        name: string
    }[]
}
type GetCategoriesFull = {
    getCategories_FULL: CategoryServerType[]
}
const GET_CATEGORIES_FULL = gql`
    query GET_CATEGORIES_FULL {
        getCategories_FULL {
            category_id
            name
            sub_categories {
                name
            }
        }
    }
`

const Categories = () => {
    const router = useRouter()
    const {loading, logged, isAdmin} = useAuth()
    const [addModal, setAddModal] = useState(false)
    const [currentProperty, setCurrentProperty] = useState<CategoryType>({
        name: null,
        sub_categories: null
    })

    const [categories, setCategories] = useState<CategoryServerType[]>([])
    const {loading: queryLoading, refetch} = useQuery<GetCategoriesFull>(GET_CATEGORIES_FULL, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setCategories(data.getCategories_FULL)
        }
    })

    if(loading || queryLoading) {
        return <PageLoader display/>
    }
    if(!isAdmin || !logged) {
        router.push("/login")
        return <PageLoader display/>
    }
    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <button onClick={() => setAddModal(true)} className="text-white text-lg w-full p-4 text-center bg-green-standard hover:bg-green-500 transition rounded-lg shadow-lg">
                Add Category
            </button>
            {
                categories.map(_ =>
                    <Category
                        refetch={refetch}
                        category={_}
                        key={_.name}
                    />
                )
            }
            {
                addModal &&
                <AddForm
                    category={{category_id: "", name: "", sub_categories: []}}
                    modalOpen={{
                        value: addModal,
                        set: setAddModal
                    }}
                    currentProperty={{
                        value: currentProperty,
                        set: setCurrentProperty
                    }}
                    refetch={refetch}
                />
            }
        </LayoutPrivate>
    );
};


type PropsCategory = {
    category: CategoryServerType
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<GetCategoriesFull>>
}
const Category: NextPage<PropsCategory> = ({category, refetch}) => {
    const circleRef = useRef<HTMLDivElement>(null)
    const [categoryOpen, setCategoryOpen] = useState(false)

    const [editModal, setEditModal] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)

    const [currentProperty, setCurrentProperty] = useState<CategoryType>({
        name: null,
        sub_categories: null
    })

    useEffect(() => {
        if(circleRef.current !== null){
            if(categoryOpen){
                circleRef.current.style.transform = "rotate(180deg)"
            }else{
                circleRef.current.style.transform = "rotate(0deg)"
            }
        }
    }, [categoryOpen])


    return (
        <div className="w-full p-5 shadow-lg bg-neutral-100 rounded-lg flex flex-col gap-8">
            <div onClick={() => setCategoryOpen(!categoryOpen)} className="cursor-pointer flex-row justify-between flex gap-3">
                <div className="w-full">
                    <span className="text-3xl text-neutral-700">{category.name}</span>
                </div>
                <div className="flex flex-row items-center gap-8">
                    <HiPencilAlt onClick={() => setEditModal(true)} className="text-2xl hover:text-green-standard transition"/>
                    <BsFillTrashFill onClick={() => setRemoveModal(true)} className="text-2xl text-red-600 hover:text-red-500 transition"/>
                    <div ref={circleRef} className="transition-all">
                        <IoArrowDownCircle className="text-4xl"/>
                    </div>
                </div>
            </div>
            {
                categoryOpen &&
                <div className="w-full flex flex-col gap-6">
                    {
                        category.sub_categories.map(_ =>
                            <div key={_.name} className="ml-8 w-full flex flex-row items-center gap-6">
                                <BiSubdirectoryRight className="text-3xl"/>
                                <span className="text-xl">{_.name}</span>
                            </div>
                        )
                    }
                </div>


            }
            {
                editModal &&
                <EditForm
                    category={category}
                    modalOpen={{
                        value: editModal,
                        set: setEditModal
                    }}
                    currentProperty={{
                        value: currentProperty,
                        set: setCurrentProperty
                    }}
                    refetch={refetch}
                />
            }
            {
                removeModal &&
                <RemoveForm
                    category={category}
                    modalOpen={{
                        value: removeModal,
                        set: setRemoveModal
                    }}
                    refetch={refetch}
                />
            }
        </div>
    )
}

export default Categories;
export type {CategoryType, CategoryServerType}