import React, {useEffect, useState} from 'react';
import Article from "../single_element/article";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import "swiper/css/bundle"
import {useResizer} from "../../../../contexts/resizer-context";
import {gql, useQuery} from "@apollo/client";

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
    discountOnly: true
    outOfStock: false
    order: "Higher Discounts"
    keywords: "All Products"
    offset: 0
    limit: 10
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

const ArticleList = () => {
    const [slidesPerView, setSlidesPerView] = useState<number | "auto">(4)
    const [slidesPerGroup, setSlidesPerGroup] = useState(4)
    const [slidesPerGroupAuto, setSlidesPerGroupAuto] = useState(false)
    const [items, setItems] = useState<Item[]>([])


    const {} = useQuery<GetItemsPaginationType, GetItemsPaginationVarType>(GET_ITEMS_PAGINATION, {
        variables: {
            keywords: "All Products",
            limit: 10,
            discountOnly: true,
            offset: 0,
            order: "Higher Discounts",
            outOfStock: false
        },
        onCompleted: (data) => {
            setItems(data.getItems_pagination)
        }
    })

    const {widthPage} = useResizer()
    useEffect(() => {
        if(widthPage > 950 && widthPage <= 1152){
            setSlidesPerView(3)
            setSlidesPerGroup(3)
        }else if(widthPage > 640 && widthPage <= 950){
            setSlidesPerView(2)
            setSlidesPerGroup(3)
        }else if(widthPage <= 640){
            setSlidesPerView(1)
            setSlidesPerGroup(1)
            setSlidesPerGroupAuto(true)
        }else{
            setSlidesPerView(4)
            setSlidesPerGroup(4)
            setSlidesPerGroupAuto(false)
        }
    }, [widthPage])


    return (
        <section className="flex flex-col gap-6 py-8 smxl:px-14 px-6 w-full">
            <h2 className="text-3xl font-semibold ">Weekly Discounts</h2>
            <span className="pt-[1px] bg-neutral-500"/>
            <div>
                <Swiper
                    loop={false}
                    autoHeight={true}
                    draggable={true}
                    slidesPerView={slidesPerView}
                    slidesPerGroup={slidesPerGroup}
                    slidesPerGroupAuto={slidesPerGroupAuto}
                    spaceBetween={50}
                    grabCursor={true}
                    navigation={true}
                    modules={[Navigation]}
                    className=""
                >
                    {items.map((element) =>
                        <SwiperSlide key={element.item_id}>
                            <Article key={element.item_id} item={{
                                item_id: Number(element.item_id),
                                name: element.name,
                                amount_available: element.amount_available,
                                photo_loc: element.photo_loc,
                                price_total: element.price_total,
                                discount: element.discount ? {
                                    percentage: element.discount.percentage
                                } : null
                            }}/>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default ArticleList;