import React, {useEffect, useRef} from 'react';
import Image from "next/legacy/image";
import TomatoImage from "../../public/media/photos/index/index-bottom.webp";
import {BiPlus} from "react-icons/bi";
import {BsFacebook, BsInstagram} from "react-icons/bs";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";

const Contact = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(heightPage > 0 && navHeight && fullPageRef.current !== null){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [navHeight, heightPage])

    return (
        <div ref={fullPageRef} className={"relative w-full h-full flex lg:flex-row flex-col items-center justify-evenly"}>
            <div className="homepage-image">
                <Image alt="Chef producing Home Made Pasta" src={TomatoImage} layout={"fill"} objectFit={"cover"}/>
            </div>
            <div className="p-8 w-full smxl:w-fit flex flex-col items-center justify-center gap-14 z-20 text-white bg-[rgb(0,0,0,0.8)]">
                <h2 className="xls:text-6xl sm:text-5xl text-3xl text-center leading-10">Follow Us on Our Social</h2>
                <div className="space-y-8">
                    <div className="xls:text-3xl sm:text-2xl text-xl text flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard"/>
                        <span>Tons of Photos</span>
                    </div>
                    <div className="xls:text-3xl sm:text-2xl text-xl text flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard"/>
                        <span>Live Sessions for Your Questions</span>
                    </div>
                    <div className="xls:text-3xl sm:text-2xl text-xl text flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard"/>
                        <span>Discount Coupon Codes</span>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-center smxl:w-fit flex-col gap-12 p-8 bg-[rgb(0,0,0,0.8)] z-20 text-white xls:text-4xl smxl:text-3xl text-2xl">
                <a rel={"noreferrer"} target={"_blank"} href={"https://www.facebook.com/people/Ivaldi-Italian-Food/100089324176503/"} className="flex flex-row items-center gap-8">
                    <BsFacebook/>
                    <span>Ivaldi Italian Food</span>
                </a>
                <a rel={"noreferrer"} target={"_blank"} href={"https://www.instagram.com/ivaldi_italian_food/"} className="flex flex-row items-center gap-8">
                    <BsInstagram/>
                    <span>Ivaldi Italian Food</span>
                </a>
            </div>
        </div>
    );
};

export default Contact;