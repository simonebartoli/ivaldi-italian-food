import React, {useEffect, useState} from 'react';
import Image from "next/image";

import {Autoplay, Navigation} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle"
import {useResizer} from "../../../../contexts/resizer-context";
import {useRouter} from "next/router";
import {logos} from "../../../index/temp/homepage-slider";


const BestLogoList = () => {
    const router = useRouter()
    const [slidesPerView, setSlidesPerView] = useState<number | "auto">(5)

    const {widthPage} = useResizer()
    useEffect(() => {
        if(widthPage > 950 && widthPage <= 1152){
            setSlidesPerView(4)
        }else if(widthPage > 640 && widthPage <= 950){
            setSlidesPerView(3)
        }else if(widthPage <= 640){
            setSlidesPerView(2)
        }else{
            setSlidesPerView(5)
        }
    }, [widthPage])

    const redirect = (query: string) => {
        router.push("/search?query=" + query)
    }

    return (
        <section className="flex flex-col w-full items-center gap-8 pt-4 centered-swiper">
            <h2 className="font-semibold text-3xl p-4 text-center leading-10">Discover our Most Popular Brands</h2>
            <Swiper
                loop={true}
                autoHeight={false}
                draggable={true}
                slidesPerView={slidesPerView}
                slidesPerGroup={1}
                spaceBetween={50}
                freeMode={true}
                grabCursor={true}
                autoplay={{
                    delay: 2000
                }}
                centeredSlides={true}
                navigation={false}
                modules={[Navigation, Autoplay]}
                className="w-full border-t-[1px] border-black"
            >
                {
                    logos.map(_ =>
                        <SwiperSlide key={_.name}>
                            <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                                <Image onClick={() => redirect(_.name.toLowerCase())} alt={`image ${_.name.toLowerCase()}`} src={_.url} layout="fill" objectFit="cover" className="image"/>
                            </div>
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </section>
    );
};

export default BestLogoList;