import React from 'react';
import PastaImage from "../../public/media/photos/index/pasta.jpg"
import ParmigianoImage from "../../public/media/photos/index/parmigiano.jpg"
import SalsicciaImage from "../../public/media/photos/index/salsiccia.jpg"
import BiscuitsImage from "../../public/media/photos/index/biscuits.jpg"

import Image from "next/image"
import Link from "next/link";

import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css/bundle"
import {Autoplay, EffectFade, Pagination} from "swiper";


const ProductsSwiper = () => {
    return (
        <>
            <Swiper
                loop={true}
                effect={"fade"}
                autoplay={{
                    delay: 2500
                }}
                draggable={true}
                grabCursor={true}
                modules={[EffectFade, Pagination, Autoplay]}
                className="h-full"
            >
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className="xls:w-2/3 w-5/6 flex flex-col items-center justify-center gap-8 z-20 text-center leading-[4rem] absolute top-1/2 left-1/2 text-5xl text-white -translate-y-1/2 -translate-x-1/2">
                            <span>Discover Our Pasta Collections</span>
                            <Link href={"/shop"}>
                                <a href="" className="block h-full p-4 w-3/4 text-white text-2xl border-2 rounded-lg border-white relative">Check Our Pasta</a>
                            </Link>
                        </div>
                        <div className="homepage-image">
                            <Image alt="Pasta Image" src={PastaImage} layout="fill" objectFit={"cover"}/>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className="xls:w-2/3 w-5/6 flex flex-col items-center justify-center gap-8 z-20 text-center leading-[4rem] absolute top-1/2 left-1/2 text-5xl text-white -translate-y-1/2 -translate-x-1/2">
                            <span>Discover Our Cheese Collections</span>
                            <Link href={"/shop"}>
                                <a href="" className="block h-full p-4 w-3/4 text-white text-2xl border-2 rounded-lg border-white relative">Check Our Cheese</a>
                            </Link>
                        </div>
                        <div className="homepage-image">
                            <Image alt="Parmigiano Reggiano Image" src={ParmigianoImage} layout="fill" objectFit={"cover"}/>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className="xls:w-2/3 w-5/6 flex flex-col items-center justify-center gap-8 z-20 text-center leading-[4rem] absolute top-1/2 left-1/2 text-5xl text-white -translate-y-1/2 -translate-x-1/2">
                            <span>Discover Our Sausages Collections</span>
                            <Link href={"/shop"}>
                                <a href="" className="block h-full p-4 w-3/4 text-white text-2xl border-2 rounded-lg border-white relative">Check Our Sausages</a>
                            </Link>
                        </div>
                        <div className="homepage-image">
                            <Image alt="Salsiccia Image" src={SalsicciaImage} layout="fill" objectFit={"cover"}/>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative w-full h-full">
                        <div className="xls:w-2/3 w-5/6 flex flex-col items-center justify-center gap-8 z-20 text-center leading-[4rem] absolute top-1/2 left-1/2 text-5xl text-white -translate-y-1/2 -translate-x-1/2">
                            <span>Discover Our Biscuits Collections</span>
                            <Link href={"/shop"}>
                                <a href="" className="block h-full p-4 w-3/4 text-white text-2xl border-2 rounded-lg border-white relative">Check Our Biscuits</a>
                            </Link>
                        </div>
                        <div className="homepage-image">
                            <Image alt="Biscuits Image" src={BiscuitsImage} layout="fill" objectFit={"cover"}/>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
};

export default ProductsSwiper;