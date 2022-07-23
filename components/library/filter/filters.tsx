import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {IoSearchSharp} from "react-icons/io5";
import {useLayoutContext} from "../../../contexts/layout-context";
import {NextPage} from "next";
import OrderBy from "./order-by";
import SelectCategory from "./select-category";
import FilterMobile from "./mobile/filter-mobile";
import {useRouter} from "next/router";
import SearchResults from "./search-results";
import {useResizer} from "../../../contexts/resizer-context";
import {gql, useLazyQuery} from "@apollo/client";

type Props = {
    highContrastSearchBar: (status: boolean) => void
}


type Item = {
    name: string
    price_total: number
    importance: number
    price_unit: string
    photo_loc: string
}

type ItemServer = Item & {item_id: string}
type ItemReact = Item & {item_id: number}


type GetItemsPaginationType = {
    getItems_pagination: ItemServer[]
}
type GetItemsPaginationVarType = {
    keywords: string
}


const GET_ITEMS_PAGINATION = gql`
    query GET_ITEMS_PAGINATION ($keywords: String!) {
        getItems_pagination(offset: 0, limit: 3, keywords: $keywords){
            item_id
            name
            price_total
            importance
            price_unit
            photo_loc
        }
    }
`

const Filters: NextPage<Props> = ({highContrastSearchBar}) => {
    const router = useRouter()
    const {widthPage} = useResizer()

    const [items, setItems] = useState<ItemReact[]>([])
    const [getItemsPagination] = useLazyQuery<GetItemsPaginationType, GetItemsPaginationVarType>(GET_ITEMS_PAGINATION, {
        onCompleted: (data) => {
            const newItems: ItemReact[] = []
            for(const item of data.getItems_pagination){
                newItems.push({
                    ...item,
                    item_id: Number(item.item_id)
                })
            }
            setItems(newItems)
        }
    })

    const {navHeight, searchBarRef, setSearchBarHeight} = useLayoutContext()

    const [search, setSearch] = useState("")
    const [stop, setStop] = useState(true)
    const timer = useRef<ReturnType<typeof setTimeout>>()

    const [order, setOrder] = useState(router.query.order !== undefined ? router.query.order as string : "Most Relevant")

    const [render, setRender] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if(searchBarRef.current !== null && navHeight !== undefined){
            setSearchBarHeight(searchBarRef.current.clientHeight)
        }
    }, [navHeight])


    const handleSearchButtonClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        highContrastSearchBar(false)
        router.push("/search?query=" + search + "&order=" + order)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(timer.current !== undefined) clearTimeout(timer.current)
        setSearch(e.target.value)
        setStop(true)

        timer.current = setTimeout(() => setStop(false), 750)
    }

    useEffect(() => {
        if(render){
            let {query} = router.query
            if(query === undefined){
                query = "All Products"
            }
            router.push("/search?query=" + query + "&order=" + order)
            setRender(false)
        }
    }, [order, render])

    useEffect(() => {
        setReady(true)
    }, [])

    useEffect(() => {
        if(search.length >= 3 && !stop){
            getItemsPagination({
                variables: {
                    keywords: search
                }
            })
        }else{
            setItems([])
        }
    }, [search, stop])



    return (
        <section ref={searchBarRef} className="
                smxl:px-8 px-4 py-6 z-40 sticky top-0 flex flex-row
                items-center shadow-lg border-b-4 border-green-standard
                justify-around w-full bg-neutral-100 gap-4 relative">

            <SelectCategory/>
            <div className="xls:basis-1/2 basis-3/5 relative flex flex-col">
                <form onSubmit={(e) => handleSearchButtonClick(e)} className="flex flex-row items-center">
                    <input type="text"
                           placeholder="Search here..."
                           value={search}
                           required
                           onChange={(e) => handleSearchChange(e)}
                           className="
                       p-3 border-l-[1px] border-t-[1px] border-b-[1px] border-black w-full smxl:basis-11/12 basis-5/6
                       text-lg rounded-l-md focus:outline-none"
                           onFocus={() => highContrastSearchBar(true)}
                           onBlur={() => highContrastSearchBar(false)}
                    />
                    <button type={"submit"} className="
                    rounded-r-md flex border-r-[1px] border-t-[1px] border-b-[1px] border-black flex-col
                    items-center justify-center self-stretch smxl:basis-1/12 basis-1/6 bg-orange-400 text-2xl cursor-pointer">
                        <IoSearchSharp className="text-white"/>
                    </button>
                </form>
                {ready && widthPage > 950 && <SearchResults items={items}/>}
            </div>
            <OrderBy order={order} setOrder={setOrder} setRender={setRender}/>
            {ready && widthPage <= 950 && <SearchResults items={items}/>}
            <FilterMobile/>
        </section>
    );
};

export default Filters;