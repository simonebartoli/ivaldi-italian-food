import React, {useEffect, useState} from 'react';
import {AiOutlineAntDesign} from "react-icons/ai";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper";
import Image from "next/image";
import "swiper/css/bundle"
import {useResizer} from "../../../contexts/resizer-context";

export const logos = [
    {
        name: "balocco",
        url: "/media/photos/shop/logo/balocco.webp"
    },
    {
        name: "rio mare",
        url: "/media/photos/shop/logo/riomare.png"
    },
    {
        name: "corte buona",
        url: "/media/photos/shop/logo/cortebuona.webp"
    },
    {
        name: "caputo",
        url: "/media/photos/shop/logo/caputo.jpg"
    },
    {
        name: "d'amico",
        url: "/media/photos/shop/logo/damico.png"
    },
    {
        name: "dega",
        url: "/media/photos/shop/logo/dega.webp"
    },
    {
        name: "divella",
        url: "/media/photos/shop/logo/divella.jpeg"
    },
    {
        name: "levoni",
        url: "/media/photos/shop/logo/levoni.png"
    },
    {
        name: "pivetti",
        url: "/media/photos/shop/logo/pivetti.webp"
    },
    {
        name: "pomi",
        url: "/media/photos/shop/logo/pomi.jpg"
    },
    {
        name: "san carlo",
        url: "/media/photos/shop/logo/sancarlo.png"
    },
    {
        name: "santal",
        url: "/media/photos/shop/logo/santal.jpg"
    },
    {
        name: "voiello",
        url: "/media/photos/shop/logo/voiello.webp"
    },
    {
        name: "barilla",
        url: "/media/photos/shop/logo/barilla.jpg"
    },
    {
        name: "mutti",
        url: "/media/photos/shop/logo/mutti.webp"
    },
    {
        name: "mulino bianco",
        url: "/media/photos/shop/logo/mulinobianco.webp"
    },
    {
        name: "ferrero",
        url: "/media/photos/shop/logo/ferrero.png"
    },
    {
        name: "rummo",
        url: "/media/photos/shop/logo/rummo.jpg"
    },
    {
        name: "delizie calabria",
        url: "/media/photos/shop/logo/delizie-di-calabria.jpg"
    },
    {
        name: "gragnano",
        url: "/media/photos/shop/logo/gragnano.png"
    },
    {
        name: "salsicciamo",
        url: "/media/photos/shop/logo/salsicciamo.png"
    },
    {
        name: "cinquina",
        url: "/media/photos/shop/logo/cinquina.webp"
    },
    {
        name: "gran pavesi",
        url: "/media/photos/shop/logo/gran-pavesi.webp"
    },
    {
        name: "le ife",
        url: "/media/photos/shop/logo/le-ife.jpg"
    },
    {
        name: "strianese",
        url: "/media/photos/shop/logo/strianese.jpg"
    },
    {
        name: "pan ducale",
        url: "/media/photos/shop/logo/panducale.png"
    },
    {
        name: "d'addezio",
        url: "/media/photos/shop/logo/addezio.webp"
    },
    {
        name: "terre di puglia",
        url: "/media/photos/shop/logo/terre-di-puglia.png"
    },
    {
        name: "zuccato",
        url: "/media/photos/shop/logo/zuccato.png"
    }
]

const HomepageSlider = () => {
    const {widthPage} = useResizer()
    const [slidePerView, setSlidePerView] = useState(3)

    useEffect(() => {
        setSlidePerView(widthPage >= 1152 || (widthPage < 950 && widthPage >= 500) ? 3 : widthPage < 500 ? 1 : 2)
    }, [widthPage])

    return (
        <section className="flex mdxl:flex-row flex-col justify-center items-center w-full smxl:p-8 p-4 py-24 gap-20">
            <div className="mdxl:w-1/2 w-full smxl:p-8 p-4 flex flex-col gap-16 font-navbar">
                <span className="text-xl text-justify leading-[2.5rem]">
                    Ivaldi is an Italian family that is very familiar with authentic, quality food: our aim is to provide you with the best food products while maintaining an honest price and clear service.
                </span>
                <div className="flex flex-col gap-14">
                    <span className="text-lg flex flex-row items-center gap-8">
                        <AiOutlineAntDesign className="w-[12.5%] text-3xl text-green-standard"/>
                        <span className="w-[87.5%]">More than 300 food products from the most famous brands</span>
                    </span>
                    <span className="text-lg flex flex-row items-center gap-8">
                        <AiOutlineAntDesign className="w-[12.5%] text-3xl text-green-standard"/>
                        <span className="w-[87.5%]">Wine and beers produced in Italy by the best producers</span>
                    </span>
                    <span className="text-lg flex flex-row items-center gap-8">
                        <AiOutlineAntDesign className="w-[12.5%] text-3xl text-green-standard"/>
                        <span className="w-[87.5%]">Deliveries throughout London</span>
                    </span>
                    <span className="text-lg flex flex-row items-center gap-8">
                        <AiOutlineAntDesign className="w-[12.5%] text-3xl text-green-standard"/>
                        <span className="w-[87.5%]">Offers up to 50%</span>
                    </span>
                    <span className="text-lg flex flex-row items-center gap-8">
                        <AiOutlineAntDesign className="w-[12.5%] text-3xl text-green-standard"/>
                        <span className="w-[87.5%]">Secure and fast payments with Cards, Google/Apple Pay and Paypal</span>
                    </span>
                </div>
            </div>
            <div className="mdxl:w-1/2 w-full flex flex-col items-center justify-center gap-16 ">
                <Swiper
                    loop={true}
                    autoHeight={false}
                    draggable={true}
                    slidesPerView={slidePerView}
                    slidesPerGroup={1}
                    spaceBetween={50}
                    freeMode={true}
                    grabCursor={true}
                    autoplay={{
                        delay: 2500
                    }}
                    centeredSlides={true}
                    navigation={false}
                    modules={[Navigation, Autoplay]}
                    className="w-full h-full centered-swiper-edited"
                >
                    {
                        logos.slice(0, 7).map((_, index) =>
                            <SwiperSlide key={index}>
                                <div className="shop-list p-4 w-full flex flex-row items-center h-[200px]">
                                    <Image alt={`image ${_.name}`} src={_.url} priority={true} layout="fill" objectFit="contain" className=""/>
                                </div>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
                <Swiper
                    loop={true}
                    autoHeight={false}
                    draggable={true}
                    slidesPerView={slidePerView}
                    slidesPerGroup={1}
                    spaceBetween={50}
                    freeMode={true}
                    grabCursor={true}
                    autoplay={{
                        reverseDirection: true,
                        delay: 2500
                    }}
                    centeredSlides={true}
                    navigation={false}
                    modules={[Navigation, Autoplay]}
                    className="w-full h-full centered-swiper-edited"
                >
                    {
                        logos.slice(7, 14).map((_, index) =>
                            <SwiperSlide key={index}>
                                <div className="shop-list p-4 w-full flex flex-row items-center h-[200px]">
                                    <Image alt={`image ${_.name}`} src={_.url} priority={true} layout="fill" objectFit="contain" className=""/>
                                </div>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
                <Swiper
                    loop={true}
                    autoHeight={false}
                    draggable={true}
                    slidesPerView={slidePerView}
                    slidesPerGroup={1}
                    spaceBetween={50}
                    freeMode={true}
                    grabCursor={true}
                    autoplay={{
                        delay: 2500
                    }}
                    centeredSlides={true}
                    navigation={false}
                    modules={[Navigation, Autoplay]}
                    className="w-full h-full centered-swiper-edited"
                >
                    {
                        logos.slice(14).map((_, index) =>
                            <SwiperSlide key={index}>
                                <div className="shop-list p-4 w-full flex flex-row items-center justify-center h-[200px]">
                                    <Image alt={`image ${_.name}`} src={_.url} priority={true} layout="fill" objectFit="contain" className="image w-full"/>
                                </div>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </div>
        </section>
    );
};

export default HomepageSlider;