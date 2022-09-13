import React, {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper";
import "swiper/css/bundle"
import HomeSection from "../single_element/homeSection";
import {useLayoutContext} from "../../../../contexts/layout-context";
import {useResizer} from "../../../../contexts/resizer-context";
import {gql, useQuery} from "@apollo/client";
import PageLoader from "../../../page-loader";
import {useCart} from "../../../../contexts/cart-context";
import {toast} from "react-toastify";
import {SERVER_ERRORS_ENUM} from "../../../../enums/SERVER_ERRORS_ENUM";

type ItemType = {
    item_id: number
    photo_loc: string
    name: string
    price_total: number
    amount_available: number
    discount: {
        percentage: number
    } | null
}
type GetPrioritiesType = {
    getItems_FULL: ItemType[]
}
const GET_PRIORITIES = gql`
    query GET_PRIORITIES {
        getItems_FULL(priority: true, keywords: "All Products"){
            item_id
            photo_loc
            name
            price_total
            discount {
                percentage
            }
        }
    }
`

const HomeSectionList = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {item: itemFromContext, error, functions: {addToCart, resetErrorItemStatus}} = useCart()
    const {searchBarHeight} = useLayoutContext()
    const {navHeight} = useLayoutContext()
    const {heightPage, widthPage} = useResizer()

    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const item_idRef = useRef<number | null>(null)

    const handleAddToCartButtonClick = (item_id: number) => {
        setLoading(true)
        item_idRef.current = item_id
        addToCart(item_id, 1)
    }

    const [products, setProducts] = useState<GetPrioritiesType["getItems_FULL"]>([])

    const {loading: queryLoading} = useQuery<GetPrioritiesType>(GET_PRIORITIES, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setProducts(data.getItems_FULL.map(_ => {
                return {
                    ..._,
                    item_id: Number(_.item_id)
                }
            }))
        }
    })
    useEffect(() => {
        if(searchBarHeight !== undefined && navHeight !== undefined && fullPageRef.current !== null){
            if(widthPage > 1152){
                fullPageRef.current.style.height = `${heightPage - navHeight - searchBarHeight}px`
            }else{
                fullPageRef.current.style.height = "auto"
            }
        }
    }, [searchBarHeight, navHeight, heightPage, widthPage, loading])
    useEffect(() => {
        if(error !== null && itemFromContext !== null && itemFromContext.item_id === item_idRef.current){
            item_idRef.current = null
            if(error === false){
                toast.success("Item Added To Your Cart.")
            }else if(error.graphQLErrors[0] !== undefined && error.graphQLErrors[0].extensions.type === SERVER_ERRORS_ENUM.AMOUNT_NOT_AVAILABLE){
                console.log(error.message)

                toast.error("This Amount Is Not Available.")
                setDisabled(true)
            }else{
                console.log(error.message)
                toast.error("Sorry, there is a problem. Try Again.")
            }
            resetErrorItemStatus()
            setLoading(false)
        }
    }, [error])


    if(queryLoading) {
        return <PageLoader display/>
    }

    return (
        <div ref={fullPageRef} className="w-full flex items-center full-container-size">
            <Swiper
                style={{
                    height: `${heightPage - (navHeight ? navHeight : 0) - (searchBarHeight ? searchBarHeight : 0)}px`
                }}
                loop={false}
                autoHeight={false}
                draggable={true}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={50}
                grabCursor={true}
                navigation={true}
                autoplay={{
                    delay: 8000,
                    pauseOnMouseEnter: true
                }}
                modules={[Navigation, Autoplay]}
                className=""
            >
                {
                    products.map(_ =>
                        <SwiperSlide key={_.item_id}>
                            <HomeSection
                                item={_}
                                handleAddToCartButtonClick={handleAddToCartButtonClick}
                                loading={loading}
                                disabled={disabled}
                            />
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </div>
    );
};

const makeRandomToken = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i <= passwordLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }
    return password
}

export default HomeSectionList;
export type {ItemType}