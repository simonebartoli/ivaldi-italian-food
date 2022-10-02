import type { NextPage } from 'next'
import React, {useEffect, useRef} from "react";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import ProductsSwiper from "../components/index/products-swiper";
import HomepageTitles from "../components/index/homepage-titles";


import WhyUs from "../components/index/why-us";
import Contact from "../components/index/contact";
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";

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
            <Head>
                <title>{`Homepage - Ivaldi Italian Food`}</title>
                <meta name="description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
                <meta name="keywords" content={"food,italy,shop,low-cost,budget,meat,fish,cakes,cheese,mozzarella,parma,campana,dececco,rummo,nutella,barilla,mutti,mulino,bianco"}/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>

                <meta property="og:title" content={`Ivaldi Italian Food`}/>
                <meta property="og:site_name" content={HOST}/>
                <meta property="og:url" content={`${HOST}`}/>
                <meta property="og:description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
                <meta property="og:type" content="product"/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={TWITTER_USERNAME}/>
                <meta name="twitter:title" content={`${HOST}`}/>
                <meta name="twitter:description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
            </Head>
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
            <Contact/>
        </main>
    )
}

export default Home
