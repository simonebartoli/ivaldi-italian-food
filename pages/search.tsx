import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Filters from "../components/library/filter/filters";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import PriceSlider from "../components/library/price-slider";
import Article from "../components/shop/index/single_element/article";
import {GetServerSideProps, NextPage} from "next";
import {apolloClient} from "./_app";
import {gql, useLazyQuery} from "@apollo/client";
import handleViewport from "react-in-viewport";

type Item = {
    item_id: number
    name: string
    discount: {
        percentage: number
    } | null
    photo_loc: string
    price_total: number
    amount_available: number
    importance: number
    hidden: boolean
}

type GetItemsType = {
    getItems_pagination: Item[]
}

type GetItemsPaginationVarType = {
    discountOnly?: boolean
    priceRange?: {
        min: number,
        max: number
    }
    outOfStock?: boolean
    keywords: string
    offset: number
    limit: number
}

const GET_ITEMS_PAGINATION = gql`
    query GET_ITEMS_PAGINATION ($offset: Int!, $limit: Int!, $discountOnly: Boolean, $priceRange: Price, $outOfStock: Boolean, $keywords: String!) {
        getItems_pagination(offset: $offset, limit: $limit, discountOnly: $discountOnly, priceRange: $priceRange, outOfStock: $outOfStock, keywords: $keywords) {
            item_id
            name
            discount {
                percentage
            }
            photo_loc
            price_total
            amount_available
        }
    }
`

type Props = {
    itemsServer: Item[]
    query: string
}

const OFFSET_BASE = 0
const LIMIT_BASE = 10
const INCREMENT = 10

const orderSearch = (items: Item[], priceRange?: { min: number, max: number }): Item[] => {
    let data: Item[] = [...items]
    if(priceRange === undefined){
        data = data.map((element) => {
            return {
                ...element,
                hidden: false,
                item_id: Number(element.item_id)
            }
        })
    }else{
        data = data.map((element) => {
            return {
                ...element,
                hidden: (!(element.price_total > priceRange.min && element.price_total < priceRange.max)),
                // FALSE WHEN INSIDE THE RANGE
                item_id: Number(element.item_id)
            }
        })
    }
    return data
}


const Search: NextPage<Props> = ({query, itemsServer}) => {
    const mainRef = useRef<HTMLDivElement>(null)
    const fullPageRef = useRef<HTMLDivElement>(null)
    const extraFilters = useRef<HTMLDivElement>(null)
    const [offsetLimit, setOffsetLimit] = useState({
        offset: OFFSET_BASE + INCREMENT,
        limit: LIMIT_BASE + INCREMENT
    })

    const {widthPage, heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()

    const [discountOnly, setDiscountOnly] = useState(false)
    const [outOfStock, setOutOfStock] = useState(false)
    const [fetchExtraProperty, setFetchExtraProperty] = useState(false)
    const [fetchPriceRange, setFetchPriceRange] = useState(false)
    const fetchMore = useRef(true)


    const [minMax, setMinMax] = useState<{min: number, max: number} | null>(null)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)

    const [items, setItems] = useState<Item[]>([])


    const [getItemsPagination] = useLazyQuery<GetItemsType, GetItemsPaginationVarType>(GET_ITEMS_PAGINATION, {
        onCompleted: (data) => {
            try{
                if(data.getItems_pagination.length !== 0){
                    if(data.getItems_pagination.length < INCREMENT){
                        fetchMore.current = false
                    }
                    setItems([...items, ...orderSearch(data.getItems_pagination)])
                }else{
                    fetchMore.current = false
                }
            }catch (e) {
                console.log(e)
            }
        }
    })

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

    useEffect(() => {
        let min = 0
        let max = 0

        setMinMax(null)

        for(const item of items){
            if(max === 0) max = item.price_total
            if(item.price_total > max) max = item.price_total

            if(min === 0) min = item.price_total
            if(item.price_total < min) min = item.price_total
        }

        if(min === 0 && max === 0) setMinMax(null)
        else setMinMax({
            min: min,
            max: max
        })
    }, [items])


    useEffect(() => {
        if(fetchExtraProperty) {
            fetchItems()
            setFetchExtraProperty(false)
        }
    }, [discountOnly, outOfStock, fetchExtraProperty])

    useEffect(() => {
        setOutOfStock(false)
        setDiscountOnly(false)
        setItems(itemsServer)
    }, [query])

    useEffect(() => {
        if(fetchPriceRange){
            window.scroll(0,0)
            setItems(orderSearch(items, {min: min, max: max}))
            setFetchPriceRange(false)
        }
    }, [min, max, fetchPriceRange])


    const handleScrollDownFetchMore = () => {
        if(fetchMore.current){
            getItemsPagination({
                variables: {
                    outOfStock: outOfStock,
                    discountOnly: discountOnly,
                    keywords: query,
                    offset: offsetLimit.offset,
                    limit: offsetLimit.limit
                }
            })
            setOffsetLimit({
                offset: offsetLimit.offset + INCREMENT,
                limit: offsetLimit.limit + INCREMENT
            })
        }
    }

    const handleDiscountOnlyOptionClick = async (e: ChangeEvent<HTMLInputElement>) => {
        setDiscountOnly(e.target.checked)
        if(!fetchExtraProperty) setFetchExtraProperty(true)
    }
    const handleOutOfStockOptionClick = async (e: ChangeEvent<HTMLInputElement>) => {
        setOutOfStock(e.target.checked)
        if(!fetchExtraProperty) setFetchExtraProperty(true)
    }


    const fetchItems = async () => {
        window.scroll(0,0)
        fetchMore.current = true
        setOffsetLimit({
            offset: OFFSET_BASE + INCREMENT,
            limit: LIMIT_BASE + INCREMENT
        })
        try{
            const result = await apolloClient.query<GetItemsType, GetItemsPaginationVarType>({
                query: GET_ITEMS_PAGINATION,
                variables: {
                    outOfStock: outOfStock,
                    discountOnly: discountOnly,
                    keywords: query,
                    offset: OFFSET_BASE,
                    limit: LIMIT_BASE
                }
            })
            if(result.data.getItems_pagination.length < INCREMENT) fetchMore.current = false
            setItems(orderSearch(result.data.getItems_pagination))
        }catch (e) {

        }
    }


    return (
        <main ref={fullPageRef} className="flex flex-col h-full">
            <Filters highContrastSearchBar={highContrastSearchBar}/>
            <div ref={mainRef} className="relative h-full flex flex-row">
                <div ref={extraFilters} className="sticky hidden bg-neutral-100 mdxl:w-1/4 md:w-1/3 w-2/5 h-full sm:flex flex-col items-start gap-10 p-10">
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input checked={discountOnly} onChange={(e) => handleDiscountOnlyOptionClick(e)} type="checkbox" className="scale-125"/>
                        <span>Discount Only</span>
                    </div>
                    <div className="flex flex-row gap-6 items-center justify-center text-xl">
                        <input checked={outOfStock} onChange={(e) => handleOutOfStockOptionClick(e)} type="checkbox" className="scale-125"/>
                        <span>Show Also Out of Stock</span>
                    </div>
                    {minMax !== null &&
                        <PriceSlider
                            min={minMax.min}
                            max={minMax.max}
                            priceMin={min}
                            priceMax={max}
                            setPriceMin={setMin}
                            setPriceMax={setMax}
                            setFetchPriceRange={setFetchPriceRange}
                        />}
                </div>
                <div className="bg-white flex flex-col gap-4 mdxl:w-3/4 md:w-2/3 sm:w-3/5 w-full smxl:p-8 p-4 items-center justify-center">
                    <span className="text-neutral-500 text-lg pb-8 underline-offset-8 underline">Search Results for:&nbsp;
                        <span className="font-semibold text-green-standard">{query}</span>
                    </span>
                    {
                        items.length === 0 ?
                        <span className="text-2xl text-neutral-500 leading-10 text-center">
                            We are sorry... No result has been found.<br/>
                            Try again with different parameters.
                        </span>
                            :
                        <div className="grid lg:grid-cols-3 mdx:grid-cols-2 grid-cols-1 gap-x-8 gap-y-14">
                            {
                                items.map((item) => {
                                    if(!item.hidden) {
                                        return (
                                            <Article
                                                key={item.item_id}
                                                item={item}
                                            />
                                        )
                                    }
                                })
                            }
                            <ViewportBlock onEnterViewport={handleScrollDownFetchMore}/>
                        </div>
                    }

                </div>
            </div>
        </main>
    );
};


const Block = (props: { inViewport: boolean, forwardedRef: React.RefObject<HTMLSpanElement> }) => {
    const {forwardedRef } = props;
    return (
        <span ref={forwardedRef}/>
    );
};
const ViewportBlock = handleViewport(Block, /** options: {}, config: {} **/);


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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
        const result = await apolloClient.query<GetItemsType, GetItemsPaginationVarType>({
            query: GET_ITEMS_PAGINATION,
            variables: {
                keywords: query,
                offset: OFFSET_BASE,
                limit: LIMIT_BASE
            }
        })
        return {
            props: {
                query: query,
                itemsServer: orderSearch(result.data.getItems_pagination)
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