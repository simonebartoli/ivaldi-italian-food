import React from 'react';
import Image from "next/image";
import {IoSearchSharp} from "react-icons/io5";
import {FiShoppingCart} from "react-icons/fi";

const HomeSection = () => {
    return (
        <div className="h-full px-8 py-2 bg-neutral-50 w-full flex lg:flex-row flex-col items-center justify-evenly">
            <div className="lg:hidden block bg-white border-[1px] border-neutral-400 p-4 my-8">
                <span className="text-3xl">
                    Discount: <span className="text-red-600 font-semibold">50% OFF</span>
                </span>
            </div>
            <div className="shop-list basis-1/2 grow shadow-2xl">
                <Image priority={true} alt="photo" src="/media/photos/shop/mozzarella2.jpg" layout="fill" objectFit="cover" className="image rounded-lg"/>
            </div>
            <div className="flex flex-col basis-1/2 grow items-center justify-center gap-12 self-stretch py-6">
                <div className="lg:block hidden bg-white border-[1px] border-neutral-400 p-4">
                    <span className="text-3xl">
                        Discount: <span className="text-red-600 font-semibold">50% OFF</span>
                    </span>
                </div>
                <span className="text-5xl ">Mozzarella</span>
                <div className="flex flex-row gap-12 items-center">
                    <span className="font-semibold text-3xl">£ 5.80</span>
                    <span className="font-semibold text-xl text-red-600 line-through">£ 8.50</span>
                </div>
                <div className="flex flex-col gap-4 sm:w-1/2 w-full">
                    <div className="cursor-pointer p-2 flex flex-row gap-4 items-center justify-center bg-green-standard text-white rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href="components/shop/index/single_element/homeSection">Check Product</a>
                        <IoSearchSharp/>
                    </div>
                    <div className="p-2 flex flex-row gap-4 items-center justify-center bg-orange-400 text-neutral-100 rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href="components/shop/index/single_element/homeSection">Add to Cart</a>
                        <FiShoppingCart/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSection;