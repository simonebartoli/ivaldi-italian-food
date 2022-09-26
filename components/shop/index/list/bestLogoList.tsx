import React, {useEffect, useState} from 'react';
import Image from "next/image";

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
                        <Image onClick={() => redirect("balocco")} alt={"image balocco"} src={"/media/photos/shop/logo/balocco.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("callipo")} alt={"image callipo"} src={"/media/photos/shop/logo/callipo.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("caputo")} alt={"image caputo"} src={"/media/photos/shop/logo/caputo.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("corte buona")} alt={"image corte buona"} src={"/media/photos/shop/logo/cortebuona.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("d'amico")} alt={"image d'amico"} src={"/media/photos/shop/logo/damico.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("dega")} alt={"image dega"} src={"/media/photos/shop/logo/dega.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("divella")} alt={"image divella"} src={"/media/photos/shop/logo/divella.jpeg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("levoni")} alt={"image levoni"} src={"/media/photos/shop/logo/levoni.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("pivetti")} alt={"image pivetti"} src={"/media/photos/shop/logo/pivetti.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("pomi")} alt={"image pomi"} src={"/media/photos/shop/logo/pomi.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("renna")} alt={"image renna"} src={"/media/photos/shop/logo/renna.jpeg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("san carlo")} alt={"image san carlo"} src={"/media/photos/shop/logo/sancarlo.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("santal")} alt={"image santal"} src={"/media/photos/shop/logo/santal.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("voiello")} alt={"image voiello"} src={"/media/photos/shop/logo/voiello.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("barilla")} alt={"image barilla"} src={"/media/photos/shop/logo/barilla.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("mutti")} alt={"image mutti"} src={"/media/photos/shop/logo/mutti.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("mulino bianco")} alt={"image mulino bianco"} src={"/media/photos/shop/logo/mulinobianco.webp"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("nutella")} alt={"image nutella"} src={"/media/photos/shop/logo/nutella.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("rummo")} alt={"image rummo"} src={"/media/photos/shop/logo/rummo.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("delizie calabria")} alt={"image delizie di calabria"} src={"/media/photos/shop/logo/delizie-di-calabria.jpg"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("gragnano")} alt={"image gragnano"} src={"/media/photos/shop/logo/gragnano.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="shop-list p-4 basis-1/5 flex flex-row items-center">
                        <Image onClick={() => redirect("salsicciamo")} alt={"image salsicciamo"} src={"/media/photos/shop/logo/salsicciamo.png"} layout="fill" objectFit="cover" className="image"/>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default BestLogoList;