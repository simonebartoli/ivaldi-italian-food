import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Filters from "../components/library/filter/filters";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import Article from "../components/shop/index/single_element/article";
import {GetServerSideProps, NextPage} from "next";
import {apolloClient} from "./_app";
import {gql, useLazyQuery} from "@apollo/client";
import handleViewport from "react-in-viewport";
import PriceRange from "../components/library/price-range";
import Head from "next/head";

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
}

type GetItemsPaginationType = {
    getItems_pagination: Item[]
}
type GetItemsPaginationVarType = {
    discountOnly?: boolean
    priceRange?: {
        min?: number,
        max?: number
    }
    outOfStock?: boolean
    order?: "Most Relevant" | "Price Ascending" | "Price Descending" | "Higher Discounts"
    keywords: string
    offset: number
    limit: number
}
const GET_ITEMS_PAGINATION = gql`
    query GET_ITEMS_PAGINATION ($offset: Int!, $limit: Int!, $discountOnly: Boolean, $priceRange: Price, $outOfStock: Boolean, $keywords: String!, $order: String) {
        getItems_pagination(offset: $offset, limit: $limit, discountOnly: $discountOnly, priceRange: $priceRange, outOfStock: $outOfStock, keywords: $keywords, order: $order) {
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
    order: "Most Relevant" | "Price Ascending" | "Price Descending" | "Higher Discounts" | null
}

const OFFSET_BASE = 0
const LIMIT_BASE = 10
const INCREMENT = 10

const orderSearch = (items: Item[]): Item[] => {
    let data: Item[] = [...items]
    data = data.map((element) => {
        return {
            ...element,
            item_id: Number(element.item_id)
        }
    })
    return data
}


const Search: NextPage<Props> = ({query, itemsServer, order}) => {
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

    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)
    const [minTypedByUser, setMinTypedByUser] = useState(false)
    const [maxTypedByUser, setMaxTypedByUser] = useState(false)

    const minMaxToCheck = useRef(true)

    const [items, setItems] = useState<Item[]>([])


    const [getItemsPagination] = useLazyQuery<GetItemsPaginationType, GetItemsPaginationVarType>(GET_ITEMS_PAGINATION, {
        onCompleted: (data) => {
            try{
                if(data.getItems_pagination.length !== 0){
                    if(data.getItems_pagination.length < INCREMENT){
                        fetchMore.current = false
                    }
                    minMaxToCheck.current = true
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
        if(fetchExtraProperty) {
            fetchItems()
            setFetchExtraProperty(false)
        }
    }, [discountOnly, outOfStock, fetchExtraProperty])

    useEffect(() => {
        setOutOfStock(false)
        setDiscountOnly(false)
        setMaxTypedByUser(false)
        setMinTypedByUser(false)
        setItems(orderSearch(itemsServer))
        minMaxToCheck.current = true
        fetchMore.current = true
        setOffsetLimit({
            offset: OFFSET_BASE + INCREMENT,
            limit: LIMIT_BASE + INCREMENT
        })
    }, [query, order])

    useEffect(() => {
        if(fetchPriceRange){
            window.scroll(0,0)
            fetchItems()
            setFetchPriceRange(false)
        }
    }, [min, max, fetchPriceRange])
    useEffect(() => {
        if(minMaxToCheck.current){
            let min = 0
            let max = 0
            if(items.length > 0){
                for(const item of items){
                    if((item.price_total < min || min === 0) && !minTypedByUser) min = item.price_total
                    if((item.price_total > max || max === 0) && !maxTypedByUser) max = item.price_total
                }
                minMaxToCheck.current = false
                if(min !== 0) setMin(min)
                if(max !== 0) setMax(max)
            }
        }
    }, [items])


    const handleScrollDownFetchMore = () => {
        if(fetchMore.current){
            getItemsPagination({
                variables: {
                    outOfStock: outOfStock,
                    discountOnly: discountOnly,
                    keywords: query,
                    order: order === null ? undefined : order,
                    priceRange: {
                        min: minTypedByUser ? min : undefined,
                        max: maxTypedByUser ? max : undefined
                    },
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
            const result = await apolloClient.query<GetItemsPaginationType, GetItemsPaginationVarType>({
                query: GET_ITEMS_PAGINATION,
                variables: {
                    outOfStock: outOfStock,
                    discountOnly: discountOnly,
                    keywords: query,
                    order: order === null ? undefined : order,
                    priceRange: {
                      min: minTypedByUser ? min : undefined,
                      max: maxTypedByUser ? max : undefined
                    },
                    offset: OFFSET_BASE,
                    limit: LIMIT_BASE
                }
            })
            if(result.data.getItems_pagination.length < INCREMENT) fetchMore.current = false
            minMaxToCheck.current = true
            setItems(orderSearch(result.data.getItems_pagination))
        }catch (e) {

        }
    }



    return (
        <main ref={fullPageRef} className="flex flex-col h-full">
            <Head>
                <title>{`Search "${query}" - Ivaldi Italian Food`}</title>
                <meta name="robots" content="noindex, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>
            </Head>
            <Filters
                highContrastSearchBar={highContrastSearchBar}
                priceRange={{
                    priceMin: {
                        value: min,
                        set: setMin
                    },
                    priceMax: {
                        value: max,
                        set: setMax
                    },
                    setFetchPriceRange: setFetchPriceRange,
                    setMinTypedByUser: setMinTypedByUser,
                    setMaxTypedByUser: setMaxTypedByUser
                }}
                extraProperty={{
                    outOfStock: outOfStock,
                    discountOnly: discountOnly,
                    handleOutOfStockOptionClick: handleOutOfStockOptionClick,
                    handleDiscountOnlyOptionClick: handleDiscountOnlyOptionClick
                }}
            />
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
                    <PriceRange
                        priceMin={{value: min, set: setMin}}
                        priceMax={{value: max, set: setMax}}
                        setFetchPriceRange={setFetchPriceRange}
                        setMinTypedByUser={setMinTypedByUser}
                        setMaxTypedByUser={setMaxTypedByUser}
                    />
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
                        <div className="grid lg:grid-cols-3 mdx:grid-cols-2 grid-cols-1 gap-x-8 gap-y-14 w-full">
                            {
                                items.map((item) => {
                                    return (
                                        <Article
                                            key={item.item_id}
                                            item={item}
                                        />
                                    )
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
    const {query, order} = context.query
    if(query === undefined || Array.isArray(query) || Array.isArray(order) || query.length < 3){
        return {
            redirect: {
                destination: "/shop",
                permanent: false
            },
            props: {}
        }
    }
    try {
        const result = await apolloClient.query<GetItemsPaginationType, GetItemsPaginationVarType>({
            query: GET_ITEMS_PAGINATION,
            variables: {
                keywords: query,
                offset: OFFSET_BASE,
                limit: LIMIT_BASE,
                order: order as "Most Relevant" | "Price Ascending" | "Price Descending" | "Higher Discounts" | undefined
            }
        })
        return {
            props: {
                query: query,
                order: order === undefined ? null : order as "Most Relevant" | "Price Ascending" | "Price Descending" | "Higher Discounts",
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