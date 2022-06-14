import type { NextPage } from 'next'
import {useEffect, useRef} from "react";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import ProductsSwiper from "../components/index/products-swiper";
import HomepageTitles from "../components/index/homepage-titles";

const Home: NextPage = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const fullPageRefTitles = useRef<HTMLDivElement>(null)
    const fullPageRefImages = useRef<HTMLDivElement>(null)

    const {heightPage, widthPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined)
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        if(widthPage <= 850){
            if(fullPageRefTitles.current !== null && fullPageRefImages.current !== null && navHeight !== undefined){
                fullPageRefTitles.current.style.minHeight = `${heightPage - navHeight}px`
                fullPageRefImages.current.style.minHeight = `${heightPage - navHeight}px`
            }
        }
    }, [heightPage, widthPage, navHeight])

    return (
        <main className="flex">
            <div ref={fullPageRef} className="transition-all relative w-full flex mdx:flex-row flex-col justify-between items-center">
                <div ref={fullPageRefImages} className="mdx:w-1/2 w-full mdx:h-full bg-neutral-100 mdx:border-r-[1px] mdx:border-t-0 border-t-[1px] border-r-0 border-black border-dashed mdx:order-1 order-2">
                    <ProductsSwiper/>
                </div>
                <div ref={fullPageRefTitles} className="mdx:w-1/2 w-full flex mdx:gap-4 gap-12 h-full flex-col justify-around items-center px-6 py-4 mdx:order-2 order-1">
                    <HomepageTitles/>
                </div>
            </div>
        </main>
    )
}

/*
            <div className="-z-10 homepage-image">
                    <Image src={HomePageImage} layout={"fill"} objectFit={"cover"} alt="Homepage Image" placeholder="blur"/>
                </div>
                <h2 className="p-6 md:text-8xl text-6xl text-white font-homeTitle font-semibold text-center leading-[6rem]">
                    <span className="md:text-7xl text-5xl">Ivaldi </span><br/>
                    Italian Food
                </h2>
                <span className="p-6 md:text-4xl sm:text-3xl text-2xl text-white text-center leading-[3rem]">
                    <span>Always Here to Deliver You the Best </span>
                    <Typewriter options={{
                        autoStart: true,
                        loop: true,
                        strings: ["<span class='underline underline-offset-8'>Experience</span>",
                            "<span class='underline underline-offset-8'>Prices</span>",
                            "<span class='underline underline-offset-8'>Discounts</span>",
                            "<span class='underline underline-offset-8'>Food</span>"]
                    }}/>
                </span>
                <div className={"sm:w-1/3 w-2/3 relative m-6"}>
                    <Link href={"/shop"}>
                        <a className="cursor-pointer block rounded-xl border-white shadow-lg p-6 border-2 text-white md:text-4xl text-3xl w-full text-center">Shop</a>
                    </Link>
                </div>
* */
export default Home
