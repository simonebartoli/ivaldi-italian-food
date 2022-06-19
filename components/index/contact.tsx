import React from 'react';
import Image from "next/image";
import TomatoImage from "../../public/media/photos/index/tomato.jpg";
import {BiPlus} from "react-icons/bi";
import {BsFacebook, BsInstagram} from "react-icons/bs";

const Contact = () => {
    return (
        <>
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
                <div className="flex flex-row items-center gap-8">
                    <BsFacebook/>
                    <span>Ivaldi Italian Food</span>
                </div>
                <div className="flex flex-row items-center gap-8">
                    <BsInstagram/>
                    <span>Ivaldi Italian Food</span>
                </div>
            </div>
        </>
    );
};

export default Contact;