import React, {FormEvent, useEffect, useState} from 'react';
import {IoSearchSharp} from "react-icons/io5";
import {useLayoutContext} from "../../../contexts/layout-context";
import {NextPage} from "next";
import OrderBy from "./order-by";
import SelectCategory from "./select-category";
import FilterMobile from "./mobile/filter-mobile";
import {useRouter} from "next/router";

type Props = {
    highContrastSearchBar: (status: boolean) => void
}

const Filters: NextPage<Props> = ({highContrastSearchBar}) => {
    const {navHeight, searchBarRef, setSearchBarHeight} = useLayoutContext()
    const [search, setSearch] = useState("")
    const [order, setOrder] = useState("Most Relevant")

    const [render, setRender] = useState(false)
    const router = useRouter()

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

    return (
        <section ref={searchBarRef} className="
                smxl:px-8 px-4 py-6 z-40 sticky top-0 flex flex-row
                items-center shadow-lg border-b-4 border-green-standard
                justify-around w-full bg-neutral-100 gap-4 relative">

            <SelectCategory/>
            <form onSubmit={(e) => handleSearchButtonClick(e)} className="flex flex-row items-center xls:basis-1/2 basis-3/5">
                <input type="text"
                       placeholder="Search here..."
                       value={search}
                       required
                       onChange={(e) => setSearch(e.target.value)}
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
            <OrderBy order={order} setOrder={setOrder} setRender={setRender}/>
            <FilterMobile/>
        </section>
    );
};

export default Filters;