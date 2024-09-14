import React, {useEffect, useRef} from 'react';
import Image from "next/legacy/image";
import HomepageImageTop from "/public/media/photos/index/homepage-top.png";
import {useResizer} from "../../../contexts/resizer-context";
import {useLayoutContext} from "../../../contexts/layout-context";

const HomepageTop = () => {
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()
    const homepageTopSectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(heightPage > 0 && navHeight && homepageTopSectionRef.current !== null){
            homepageTopSectionRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [navHeight, heightPage])

    return (
        <section ref={homepageTopSectionRef} className="w-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full homepage-image homepage-image-edited">
                <Image
                    src={HomepageImageTop}
                    priority={true}
                    layout={"fill"}
                    objectFit={"cover"}
                />
            </div>
            <div className="relative flex flex-col gap-14 z-30 text-center sm:p-14 p-6 rounded-lg md:border-4 border-0 border-neutral-300">
                    <span className="lg:text-5xl text-3xl text-white leading-[3rem]">
                        Best Prices, Best Offers, Best Service At
                    </span>
                <h1 className="font-homeTitle lg:text-8xl text-6xl font-bold leading-[5rem]">
                    <span className={"text-red-600"}>Ivaldi</span> <span className="text-green-standard">Italian Food</span>
                </h1>
            </div>
        </section>
    );
};

export default HomepageTop;