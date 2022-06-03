import type { NextPage } from 'next'
import Image from "next/image";
import HomePageImage from "../public/media/photos/homepage.jpg"
import {useEffect, useRef} from "react";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import Typewriter from 'typewriter-effect';
import Link from "next/link";

const Home: NextPage = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined)
            fullPageRef.current.style.height = `${heightPage - navHeight}px`
    }, [heightPage, navHeight])

    return (
        <main className="flex">
            <div ref={fullPageRef} className="transition-all relative w-full flex flex-col justify-evenly items-center">
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
            </div>
        </main>
    )
}

export default Home
