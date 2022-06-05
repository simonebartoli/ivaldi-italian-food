import React, {useEffect, useRef} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper";
import "swiper/css/bundle"
import HomeSection from "../single_element/homeSection";
import {useLayoutContext} from "../../../../contexts/layout-context";
import {useResizer} from "../../../../contexts/resizer-context";

const HomeSectionList = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {searchBarHeight} = useLayoutContext()
    const {navHeight} = useLayoutContext()
    const {heightPage, widthPage} = useResizer()
    useEffect(() => {
        if(searchBarHeight !== undefined && navHeight !== undefined && fullPageRef.current !== null){
            if(widthPage > 1152){
                fullPageRef.current.style.height = `${heightPage - navHeight - searchBarHeight}px`
            }else{
                fullPageRef.current.style.height = "auto"
            }
        }
    }, [searchBarHeight, navHeight, heightPage, widthPage])

    return (
        <div ref={fullPageRef} className="w-full flex items-center full-container-size">
            <Swiper
                loop={true}
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
                <SwiperSlide>
                    <HomeSection/>
                </SwiperSlide>
                <SwiperSlide>
                    <HomeSection/>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default HomeSectionList;