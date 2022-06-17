import React, {useEffect, useRef} from 'react';
import Filters from "../components/library/filter/filters";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import PriceSlider from "../components/library/price-slider";
import Article from "../components/shop/index/single_element/article";

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
                <div ref={extraFilters} className="sticky hidden bg-neutral-100 mdxl:w-1/4 md:w-1/3 w-2/5 h-full sm:flex flex-col items-start gap-10 p-10">
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input type="checkbox" className="scale-125"/>
                        <span>Discount Only</span>
                    </div>
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input type="checkbox" className="scale-125"/>
                        <span>Show Also Out of Stock</span>
                    </div>
                    <PriceSlider/>
                </div>
                <div className="bg-white flex flex-col gap-4 mdxl:w-3/4 md:w-2/3 sm:w-3/5 w-full p-8 items-center justify-center">
                    <span className="text-neutral-500 text-lg pb-8 underline-offset-8 underline">Search Results for:&nbsp;
                        <span className="font-semibold text-green-standard">Pesto</span>
                    </span>
                    <div className="grid lg:grid-cols-3 mdx:grid-cols-2 grid-cols-1 gap-x-8 gap-y-14">
                        {
                            new Array(10).fill([]).map((_, index) =>
                                <Article key={index}/>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
};

/*

*/

export default Search;