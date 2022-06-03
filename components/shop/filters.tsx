import React, {useEffect, useRef} from 'react';
import {BiArrowToBottom} from "react-icons/bi";
import {IoSearchSharp} from "react-icons/io5";
import {useLayoutContext} from "../../contexts/layout-context";
import {NextPage} from "next";

type Props = {
    highContrastSearchBar: () => void
}

const Filters: NextPage<Props> = ({highContrastSearchBar}) => {
    const {navHeight} = useLayoutContext()
    const searchBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(searchBarRef.current !== null && navHeight !== undefined){
            searchBarRef.current.style.top = `${navHeight}px`
        }
    }, [navHeight])

    return (
        <section ref={searchBarRef} className="
                px-8 py-6 z-40 sticky flex flex-row items-center shadow-lg
                justify-around w-full bg-neutral-100">

            <div className="cursor-pointer flex flex-row gap-4 items-center text-xl p-3 justify-start border-[1px] border-neutral-400 bg-white rounded-lg">
                <span>Select Category:</span>
                <span className="font-semibold">General</span>
                <BiArrowToBottom/>
            </div>
            <form className="flex flex-row items-center w-1/2">
                <input type="text"
                       placeholder="Search here..."
                       className="
                       p-3 border-l-[1px] border-t-[1px] border-b-[1px] border-black w-full basis-11/12
                       text-lg rounded-l-md focus:outline-none"
                       onFocus={highContrastSearchBar}
                       onBlur={highContrastSearchBar}
                />
                <div className="
                    rounded-r-md flex border-r-[1px] border-t-[1px] border-b-[1px] border-black flex-col
                    items-center justify-center self-stretch basis-1/12 bg-orange-400 text-2xl cursor-pointer">
                    <IoSearchSharp className="text-white"/>
                </div>
            </form>
            <div className="cursor-pointer flex flex-row gap-4 items-center text-xl p-3 justify-end bg-white rounded-lg border-[1px] border-neutral-400">
                <span>Order By: </span>
                <span className="font-semibold">Most Relevant</span>
                <BiArrowToBottom/>
            </div>
        </section>
    );
};

export default Filters;