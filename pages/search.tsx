import React, {useEffect, useRef} from 'react';
import Filters from "../components/shop/filters";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";

const Search = () => {
    const mainRef = useRef<HTMLDivElement>(null)
    const fullPageRef = useRef<HTMLDivElement>(null)
    const extraFilters = useRef<HTMLDivElement>(null)

    const {widthPage, heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()

    const highContrastSearchBar = () => {
        if(mainRef.current !== null){
            mainRef.current.classList.toggle("brightness-50")
        }
    }

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined)
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`

        if(searchBarHeight !== undefined && navHeight !== undefined && extraFilters.current !== null){
            extraFilters.current.style.height = `${heightPage - searchBarHeight}px`
            extraFilters.current.style.top = `${searchBarHeight}px`
        }
    }, [widthPage, heightPage, navHeight, searchBarHeight])

    return (
        <main ref={fullPageRef} className="flex flex-col h-full">
            <Filters highContrastSearchBar={highContrastSearchBar}/>
            <div ref={mainRef} className="relative h-full flex flex-row">
                <div ref={extraFilters} className="sticky bg-neutral-100 w-1/4 h-full flex flex-col items-start gap-10 p-10">
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input type="checkbox" className="scale-125"/>
                        <span>Discount Only</span>
                    </div>
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input type="checkbox" className="scale-125"/>
                        <span>Show Also Out of Stock</span>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    {new Array(30).fill([]).map((_, __) => <span key={__}>1</span>)}
                </div>
            </div>
        </main>
    );
};

export default Search;