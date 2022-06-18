import React, {useEffect, useRef} from 'react';
import {AiOutlineMenu} from "react-icons/ai";
import {useResizer} from "../../../../contexts/resizer-context";
import {useLayoutContext} from "../../../../contexts/layout-context";
import OrderBy from "./order-by";
import SelectCategory from "./select-category";

const FilterMobile = () => {
    const {heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()
    const filtersRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(navHeight !== undefined && searchBarHeight !== undefined && filtersRef.current !== null){
            filtersRef.current.style.maxHeight = `${heightPage - searchBarHeight}px`
            filtersRef.current.style.top = `${searchBarHeight}px`
        }
    }, [navHeight, searchBarHeight])

    const handleContextMenuClick = () => {
        if(filtersRef.current !== null){
            filtersRef.current.classList.toggle("hidden")
        }
    }

    return (
        <div className="w-1/3 self-stretch cursor-pointer xls:hidden">
            <div onClick={handleContextMenuClick} className="flex flex-row smx:gap-4 gap-2 items-center justify-center text-xl text-base p-3 xls:justify-end bg-white rounded-lg border-[1px] border-neutral-400">
                <span className="smxl:text-xl text-lg">Filter <span className="smx:inline-block hidden">By</span> </span>
                <AiOutlineMenu className="smxl:text-xl text-lg"/>
            </div>
            <div ref={filtersRef} className="hidden overflow-y-scroll absolute shadow-lg bg-white z-20 left-0 w-full flex flex-col">
                <OrderBy/>
                <SelectCategory/>
            </div>
        </div>
    );
};

export default FilterMobile;