import type { NextPage } from 'next'
import React, {useEffect, useRef} from "react";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import ProductsSwiper from "../components/index/products-swiper";
import HomepageTitles from "../components/index/homepage-titles";


import WhyUs from "../components/index/why-us";
import Contact from "../components/index/contact";

const Home: NextPage = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const fullPageRef2 = useRef<HTMLDivElement>(null)

    const fullPageRefTitles = useRef<HTMLDivElement>(null)
    const fullPageRefImages = useRef<HTMLDivElement>(null)

    const {heightPage, widthPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined)
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`

        if(fullPageRef2.current !== null && navHeight !== undefined)
            fullPageRef2.current.style.minHeight = `${heightPage - navHeight}px`

        if(widthPage <= 850){
            if(fullPageRefTitles.current !== null && fullPageRefImages.current !== null && navHeight !== undefined){
                fullPageRefTitles.current.style.minHeight = `${heightPage - navHeight}px`
                fullPageRefImages.current.style.minHeight = `${heightPage - navHeight}px`
            }
        }
    }, [heightPage, widthPage, navHeight])

    return (
        <main className="flex flex-col w-full h-full">
            <div className="flex">
                <div ref={fullPageRef} className="transition-all relative w-full flex mdx:flex-row flex-col justify-between items-center">
                    <div ref={fullPageRefImages} className="mdx:w-1/2 w-full mdx:h-full bg-neutral-100 mdx:border-r-[1px] mdx:border-t-0 border-t-[1px] border-r-0 border-black border-dashed mdx:order-1 order-2">
                        <ProductsSwiper/>
                    </div>
                    <div ref={fullPageRefTitles} className="mdx:w-1/2 w-full flex mdx:gap-4 gap-12 h-full flex-col justify-around items-center px-6 py-4 mdx:order-2 order-1">
                        <HomepageTitles/>
                    </div>
                </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-8 items-center justify-evenly smxl:p-8 px-4 py-8 bg-neutral-100">
                <WhyUs/>
            </div>
            <div ref={fullPageRef2} className="relative w-full h-full flex lg:flex-row flex-col items-center justify-evenly">
                <Contact/>
            </div>
        </main>
    )
}

export default Home
