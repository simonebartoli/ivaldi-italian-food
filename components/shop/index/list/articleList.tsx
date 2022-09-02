import React, {useEffect, useState} from 'react';
import Article from "../single_element/article";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import "swiper/css/bundle"
import {useResizer} from "../../../../contexts/resizer-context";


const ArticleList = () => {
    const [slidesPerView, setSlidesPerView] = useState<number | "auto">(4)
    const [slidesPerGroup, setSlidesPerGroup] = useState(4)
    const [slidesPerGroupAuto, setSlidesPerGroupAuto] = useState(false)

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
                    {(new Array(13).fill([])).map((element, index) =>
                        <SwiperSlide key={index}>
                            <Article key={index} item={{
                                item_id: 1,
                                name: "test",
                                amount_available: 10,
                                photo_loc: "test",
                                price_total: 10.50,
                                discount: {
                                    percentage: 20
                                }
                            }}/>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default ArticleList;