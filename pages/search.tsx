import React, {useEffect, useRef} from 'react';
import Filters from "../components/library/filter/filters";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import PriceSlider from "../components/library/price-slider";
import Article from "../components/shop/index/single_element/article";
import {GetServerSideProps, NextPage} from "next";
import {apolloClient} from "./_app";
import {gql} from "@apollo/client";

type Item = {
    item_id: number
    name: string
    discount: {
        percentage: number
    } | null
    photo_loc: string
    price_total: number
    importance: number
}

type GetItemsFullType = {
    getItems_FULL: Item[]
}

type GetItemsFullVarType = {
    keywords: string
}


const GET_ITEMS_FULL = gql`
    query GET_ITEMS_FULL ($keywords: String!) {
        getItems_FULL(keywords: $keywords) {
            item_id
            name
            discount {
                percentage
            }
            photo_loc
            price_total
        }
    }
`

type Props = {
    items: Item[]
    query: string
}

const Search: NextPage<Props> = ({query, items}) => {
    const mainRef = useRef<HTMLDivElement>(null)
    const fullPageRef = useRef<HTMLDivElement>(null)
    const extraFilters = useRef<HTMLDivElement>(null)

    const {widthPage, heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()

    const highContrastSearchBar = (status: boolean) => {
        if(mainRef.current !== null){
            if(status) mainRef.current.classList.add("brightness-50")
            else mainRef.current.classList.remove("brightness-50")
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
                        <span className="font-semibold text-green-standard">{query}</span>
                    </span>
                    <div className="grid lg:grid-cols-3 mdx:grid-cols-2 grid-cols-1 gap-x-8 gap-y-14">
                        {
                            items.map((item) =>
                                <Article
                                    key={item.item_id}
                                    item={item}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context.query
    if(query === undefined || Array.isArray(query) || query.length < 3){
        return {
            redirect: {
                destination: "/shop",
                permanent: false
            },
            props: {}
        }
    }

    try {
        const result = await apolloClient.query<GetItemsFullType, GetItemsFullVarType>({
            query: GET_ITEMS_FULL,
            variables: {
                keywords: query
            }
        })

        let data = result.data.getItems_FULL.map((element) => {
            return {
                ...element,
                item_id: Number(element.item_id)
            }
        })
        data = data.sort((a, b) => (a.importance < b.importance) ? 1 : -1)

        return {
            props: {
                query: query,
                items: data
            }
        }
    }catch (e) {
        return {
            redirect: {
                destination: "/shop",
                permanent: false
            },
            props: {}
        }
    }
}

export default Search;