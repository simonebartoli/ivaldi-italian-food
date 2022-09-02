import React, {useEffect, useState} from 'react';
import Image from "next/image";

import BarillaImage from "../../../../public/media/photos/shop/logo/barilla.jpg"
import MuttiImage from "../../../../public/media/photos/shop/logo/mutti.png"
import MulinoBiancoImage from "../../../../public/media/photos/shop/logo/mulinobianco.png"
import NutellaImage from "../../../../public/media/photos/shop/logo/nutella.png"
import RummoImage from "../../../../public/media/photos/shop/logo/rummo.jpg"
import {Autoplay, Navigation} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle"
import {useResizer} from "../../../../contexts/resizer-context";
import {useRouter} from "next/router";

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
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("barilla")} alt={"image"} src={BarillaImage} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("mutti")} alt={"image"} src={MuttiImage} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("mulino bianco")} alt={"image"} src={MulinoBiancoImage} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("nutella")} alt={"image"} src={NutellaImage} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("rummo")} alt={"image"} src={RummoImage} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default BestLogoList;