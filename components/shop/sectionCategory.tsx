import React from 'react';
import ArticleList from "./ArticleList";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import "swiper/css/bundle"


const SectionCategory = () => {
    return (
        <section className="flex flex-col gap-6 py-8 px-14 w-full">
            <h2 className="text-3xl font-semibold ">Weekly Discounts</h2>
            <span className="pt-[1px] bg-neutral-500"/>
            <div>
                <Swiper
                    loop={false}
                    autoHeight={true}
                    draggable={true}
                    slidesPerView={4}
                    slidesPerGroup={4}
                    spaceBetween={50}
                    grabCursor={true}
                    navigation={true}
                    modules={[Navigation]}
                    className=""
                >
                    {(new Array(13).fill([])).map((element, index) =>
                        <SwiperSlide key={index}>
                            <ArticleList/>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default SectionCategory;