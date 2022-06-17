import React, {useEffect} from 'react';
import {IoSearchSharp} from "react-icons/io5";
import {useLayoutContext} from "../../../contexts/layout-context";
import {NextPage} from "next";
import {AiOutlineMenu} from "react-icons/ai";
import OrderBy from "./order-by";
import SelectCategory from "./select-category";

type Props = {
    highContrastSearchBar: () => void
}

const Filters: NextPage<Props> = ({highContrastSearchBar}) => {
    const {navHeight, searchBarRef, setSearchBarHeight} = useLayoutContext()
    useEffect(() => {
        if(searchBarRef.current !== null && navHeight !== undefined){
            setSearchBarHeight(searchBarRef.current.clientHeight)
        }
    }, [navHeight])



    return (
        <section ref={searchBarRef} className="
                smxl:px-8 px-4 py-6 z-40 sticky top-0 flex flex-row
                items-center shadow-lg border-b-4 border-green-standard
                justify-around w-full bg-neutral-100 gap-4">

            <SelectCategory/>
            <form className="flex flex-row items-center xls:basis-1/2 basis-3/5">
                <input type="text"
                       placeholder="Search here..."
                       className="
                       p-3 border-l-[1px] border-t-[1px] border-b-[1px] border-black w-full smxl:basis-11/12 basis-5/6
                       text-lg rounded-l-md focus:outline-none"
                       onFocus={highContrastSearchBar}
                       onBlur={highContrastSearchBar}
                />
                <div className="
                    rounded-r-md flex border-r-[1px] border-t-[1px] border-b-[1px] border-black flex-col
                    items-center justify-center self-stretch smxl:basis-1/12 basis-1/6 bg-orange-400 text-2xl cursor-pointer">
                    <IoSearchSharp className="text-white"/>
                </div>
            </form>
            <OrderBy/>
            <div className="self-stretch w-fit cursor-pointer xls:hidden flex flex-row smx:gap-4 gap-2 items-center justify-center text-xl text-base p-3 xls:justify-end bg-white rounded-lg border-[1px] border-neutral-400">
                <span>Filter <span className="smx:inline-block hidden">By</span> </span>
                <AiOutlineMenu/>
            </div>
        </section>
    );
};

export default Filters;