import React, {forwardRef, useEffect, useRef, useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";
import {IoArrowDownCircle} from "react-icons/io5";
import {ApolloQueryResult, gql, useMutation, useQuery} from "@apollo/client";
import {NextPage} from "next";
import {BsFillTrashFill} from "react-icons/bs";
import EditForm from "../components/_ADMIN/items/modal/edit-form";
import Search from "../components/_ADMIN/items/search";
import {API_HOST} from "../settings";
import RemoveForm from "../components/_ADMIN/items/modal/remove-form";
import AddForm from "../components/_ADMIN/items/modal/add-form";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"


type Item = {
    item_id: string
    name: string
    description: string
    discount: {
        percentage: number
    } | null
    photo_loc: string
    price_total: number
    price_unit: string
    amount_available: number
    vat: {
        percentage: number
    }
    priority: boolean
    category: string[]
    keywords: string[]
}
type ItemConverted = Omit<Item, "item_id"> & {item_id: number}
type GetItemFullVarType = {
    order: string
}
type GetItemsFullType = {
    getItems_FULL: Item[]
}
const GET_ITEMS_FULL = gql`
    query GET_ITEMS_FULL($order: String, $priceRange: Price) {
        getItems_FULL(keywords: "All Products", order: $order, outOfStock: true, priceRange: $priceRange, discountOnly: false){
            item_id
            name
            description
            photo_loc
            price_total
            price_unit
            vat {
                percentage
            }
            discount {
                percentage
            }
            category
            amount_available
            keywords
            priority
        }
    }
`

type ModifyItemDetailsType = {
    modifyItemDetails: boolean
}
type ModifyItemDetailsVarType = {
    data: {
        item_id: number
        priority: boolean
    }
}
const MODIFY_ITEM_DETAILS = gql`
    mutation MODIFY_ITEM_DETAILS($data: ModifyItemDetailsInput!) {
        modifyItemDetails(data: $data)
    }
`

const Items = () => {
    const router = useRouter()
    const {loading, logged, isAdmin, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [items, setItems] = useState<ItemConverted[]>([])
    const [itemsSearch, setItemsSearch] = useState<ItemConverted[]>([])

    const [query, setQuery] = useState("")
    const [addModalOpen, setAddModalOpen] = useState(false)
    const {loading: queryLoading, refetch} = useQuery<GetItemsFullType, GetItemFullVarType>(GET_ITEMS_FULL, {
        variables: {
            order: "Price Ascending"
        },
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const result = data.getItems_FULL.map((element) => {
                return {
                    ...element,
                    item_id: Number(element.item_id)
                }
            })
            setItems(result)
        }
    })

    const item_idRef = useRef<number | null>(null)
    const priorityRef = useRef<boolean | null>(null)

    const handleChangePriority = (item_id: number, priority: boolean) => {
        item_idRef.current = item_id
        priorityRef.current = priority
        ModifyItemDetails({
            variables: {
                data: {
                    item_id: item_idRef.current,
                    priority: priorityRef.current
                }
            }
        })

    }
    const [ModifyItemDetails] = useMutation<ModifyItemDetailsType, ModifyItemDetailsVarType>(MODIFY_ITEM_DETAILS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("Element Priority Modified")
            refetch()
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if(reTry){
            ModifyItemDetails({
                variables: {
                    data: {
                        item_id: item_idRef.current!,
                        priority: priorityRef.current!
                    }
                }
            })
            setReTry(false)
        }
    }, [reTry])

    useEffect(() => {
        if(query.length > 2) {
            const result: ItemConverted[] = []
            for(const item of items){
                if((item.name.toLowerCase()).includes(query.toLowerCase())){
                    result.push(item)
                    continue
                }
                for(const category of item.category){
                    if(category.toLowerCase().includes(query.toLowerCase())){
                        result.push(item)
                    }
                }
            }
            setItemsSearch(result)
        }
    }, [query, items])


    if(loading || queryLoading) {
        return <PageLoader display/>
    }
    if(!isAdmin || !logged) {
        router.push("/login")
        return <PageLoader display/>
    }

    console.log("QUERY LOADING: " + queryLoading)

    return (
        <LayoutPrivate className="w-full self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4">
            <Search query={query} setQuery={setQuery}/>
            <button
                onClick={() => setAddModalOpen(!addModalOpen)}
                className={"w-full flex items-center justify-center disabled:cursor-not-allowed disabled:bg-neutral-500 p-3 text-lg bg-green-standard hover:bg-green-500 text-white rounded-lg shadow-md transition"}>
                Add New Product
            </button>
            {
                addModalOpen &&
                <AddForm refetch={refetch} modalOpen={{value: addModalOpen, set: setAddModalOpen}}/>
            }
            {
                query.length > 2 ?
                itemsSearch.map((element) =>
                    <Item handleChangePriority={handleChangePriority} refetch={refetch} key={element.item_id} item={element}/>
                ) :
                items.map((element) =>
                    <Item handleChangePriority={handleChangePriority} refetch={refetch} key={element.item_id} item={element}/>
                )
            }
        </LayoutPrivate>
    );
};


type PropsItem = {
    handleChangePriority: (item_id: number, priority: boolean) => void
    item: ItemConverted
    refetch: (variables?: (Partial<GetItemFullVarType> | undefined)) => Promise<ApolloQueryResult<GetItemsFullType>>
}
const Item: NextPage<PropsItem> = ({item, refetch, handleChangePriority}) => {
    const circleRef = useRef<HTMLDivElement>(null)
    const [orderOpen, setOrderOpen] = useState(false)

    useEffect(() => {
        if(circleRef.current !== null){
            if(orderOpen){
                circleRef.current.style.transform = "rotate(180deg)"
            }else{
                circleRef.current.style.transform = "rotate(0deg)"
            }
        }
    }, [orderOpen])

    return (
        <div className="flex flex-col gap-8 justify-between items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md rounded-lg">
            <Description
                handleChangePriority={handleChangePriority}
                ref={circleRef}
                orderOpen={{
                    value: orderOpen,
                    set: setOrderOpen
                }}
                item={item}
            />
            {
                orderOpen &&
                <ItemDetails refetch={refetch} item={item}/>
            }
        </div>
    )
}


type PropsDescription = {
    handleChangePriority: (item_id: number, priority: boolean) => void
    orderOpen: {
        value: boolean,
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    item: {
        item_id: number
        name: string
        price_total: number
        price_unit: string
        amount_available: number
        priority: boolean
    }
}
const Description = forwardRef<HTMLDivElement, PropsDescription>(({orderOpen, item, handleChangePriority}, circleRef) => {

    return (
        <div onClick={() => orderOpen.set(!orderOpen.value)} className="cursor-pointer flex lg:flex-row flex-col lg:gap-0 gap-8 w-full justify-between items-center">
            <div className="flex flex-row lg:gap-8 gap-4 items-center justify-start text-xl">
                <span>{item.name}</span>
                <span>-</span>
                <span>{`${item.amount_available > 0 ? "AVAILABLE" : "NOT AVAILABLE"} (x${item.amount_available})`}</span>
            </div>
            <div className="flex flex-row lg:gap-14 gap-7 items-center">
                {
                    item.priority ?
                    <AiFillStar onClick={() => handleChangePriority(item.item_id, false)} className="text-3xl text-yellow-500 cursor-pointer"/>
                    :
                    <AiOutlineStar onClick={() => handleChangePriority(item.item_id, true)} className="text-3xl text-neutral-500 cursor-pointer"/>
                }

                <span style={{color: item.amount_available > 0 ? "var(--green)" : "var(--red)"}} className="text-2xl font-bold text-green-standard">{`£${item.price_total.toFixed(2)}/${item.price_unit}`}</span>
                <div ref={circleRef} className="transition-all">
                    <IoArrowDownCircle className="text-4xl"/>
                </div>
            </div>
        </div>
    )
})

type PropsItemDetails = {
    item: ItemConverted
    refetch: (variables?: (Partial<GetItemFullVarType> | undefined)) => Promise<ApolloQueryResult<GetItemsFullType>>
}
const ItemDetails: NextPage<PropsItemDetails> = ({item, refetch}) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [removeModalOpen, setRemoveModalOpen] = useState(false)

    return (
        <div className="flex flex-col gap-6 w-full items-start">
            <hr className="border-neutral-500 w-full"/>
            <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                <span className="mdxl:w-1/4 w-full">Name of Product: </span>
                <span className="mdxl:w-3/4 w-full text-xl font-bold">{item.name}</span>
            </div>
            <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                <span className="mdxl:w-1/4 w-full">Description of Product: </span>
                <span className="mdxl:w-3/4 w-full text-xl leading-8">{item.description}</span>
            </div>
            <div className="pt-8 w-full flex flex-col gap-6">
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Price of Product: </span>
                    <span className="mdxl:w-3/4 w-full text-xl font-bold">{`£ ${item.price_total.toFixed(2)}/${item.price_unit}`}</span>
                </div>
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">VAT Percentage: </span>
                    <span className="mdxl:w-3/4 w-full text-xl">{`${item.vat.percentage}%`}</span>
                </div>
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Discounts: </span>
                    <span style={{color: item.discount ? "var(--green)" : "var(--red)"}} className="mdxl:w-3/4 w-full text-xl font-bold text-green-standard">{item.discount ? "YES" : "NO"}</span>
                </div>
                {
                    item.discount &&
                    <>
                        <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                            <span className="mdxl:w-1/4 w-full">Discounts Percentage: </span>
                            <span className="mdxl:w-3/4 w-full text-xl font-bold">{`${item.discount.percentage}%`}</span>
                        </div>
                        <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                            <span className="mdxl:w-1/4 w-full">Original Price (No Discount | Yes VAT): </span>
                            <span className="mdxl:w-3/4 w-full text-xl">{`£ ${(item.price_total / (1 - item.discount.percentage/100)).toFixed(2)}`}</span>
                        </div>
                    </>
                }
            </div>
            <div className="pt-8 w-full flex flex-col gap-6">
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Availability: </span>
                    <span style={{color: item.amount_available > 0 ? "var(--green)" : "var(--red)"}} className="mdxl:w-3/4 w-full text-xl text-green-standard font-bold">{item.amount_available > 0 ? "YES" : "NO"}</span>
                </div>
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Stock Unit: </span>
                    <span className="mdxl:w-3/4 w-full text-xl font-bold">{`x${item.amount_available}`}</span>
                </div>
            </div>
            <div className="pt-8 w-full flex flex-col gap-6">
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Photo: </span>
                    <a target={"_blank"} rel="noreferrer" href={API_HOST + item.photo_loc} className="mdxl:w-3/4 w-full text-xl underline underline-offset-4">Click Here</a>
                </div>
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Category: </span>
                    <span className="mdxl:w-3/4 w-full text-xl font-bold">{item.category.map(element => `${element}, `)}</span>
                </div>
                <div className="flex mdxl:flex-row flex-col gap-6 mdxl:items-center items-start text-lg w-full">
                    <span className="mdxl:w-1/4 w-full">Keywords: </span>
                    <span className="mdxl:w-3/4 w-full text-xl font-bold">{item.keywords.map(element => `${element}, `)}</span>
                </div>
            </div>
            <hr className="my-6 border-neutral-500 w-full"/>
            <div className={"w-full flex flex-row gap-8 items-center"}>
                <button onClick={() => setEditModalOpen(!editModalOpen)} className="transition hover:bg-green-500 p-4 rounded-lg shadow-lg text-center text-white text-xl bg-green-standard w-[300px]">Edit</button>
                <BsFillTrashFill onClick={() => setRemoveModalOpen(!removeModalOpen)} className="transition cursor-pointer hover:text-red-600 text-3xl"/>
            </div>
            {
                editModalOpen &&
                <EditForm refetch={refetch} item={item} modalOpen={{value: editModalOpen, set: setEditModalOpen}}/>
            }
            {
                removeModalOpen &&
                <RemoveForm refetch={refetch} item={item} modalOpen={{value: removeModalOpen, set: setRemoveModalOpen}}/>
            }
        </div>
    )
}

Description.displayName = "Description"
export default Items;
export type {ItemConverted}