import React from 'react';
import {BiPlus} from "react-icons/bi";
import Link from "next/link";

const HomepageTitles = () => {
    return (
        <>
            <h2 className="p-6 mdx:text-7xl text-5xl text-green-standard font-homeTitle font-semibold text-center mdx:leading-[6rem] leading-[4rem]">
                <span className="mdx:text-6xl text-4xl text-red-600">Ivaldi </span><br/>
                Italian Food
            </h2>
            <span className="font-semibold text-2xl">
                Italy has never been so close
            </span>
            <div className="flex flex-col gap-8">
                <span className="text-xl text-center">
                    Discover the Authentic Italian Food here in UK:
                </span>
                <div className="flex flex-col text-xl mdx:gap-6 gap-10 mdx:items-center items-start">
                    <div className="flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard text-2xl"/>
                        <span className="italic">Deliveries Completely Customisable</span>
                    </div>
                    <div className="flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard text-2xl"/>
                        <span className="italic">Honest prices with lots of discounts</span>
                    </div>
                    <div className="flex flex-row gap-8 items-center">
                        <BiPlus className="text-green-standard text-2xl"/>
                        <span className="italic">Tons of Products to choose from</span>
                    </div>
                </div>
            </div>
            <Link href="/shop">
                <a href={"/shop"}
                   className="mdx:m-0 my-4 hover:bg-green-standard transition p-4 mdxl:w-1/2 w-5/6 bg-green-500 text-white text-lg shadow-lg text-center rounded-lg">Go to Shop</a>
            </Link>
        </>
    );
};

export default HomepageTitles;