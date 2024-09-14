import React from 'react';
import Image from "next/legacy/image";
import {useResizer} from "../../contexts/resizer-context";

const Product = () => {
    const {widthPage} = useResizer()

    return (
        <section className="flex lg:flex-row gap-6 lg:gap-0 flex-col items-center justify-between w-full bg-white smx:p-6 px-4 py-6 rounded-lg">
            <div className="flex md:flex-row sm:flex-col smxl:flex-row flex-col gap-8 items-center">
                <div className="relative md:w-1/4 sm:w-1/2 smxl:w-1/4 smx:w-1/2 w-3/4 h-full shop-list">
                    <Image src="/media/photos/shop/ragu_funghi_300x.png" layout="fill" objectFit="contain" className="image"/>
                </div>
                <div className="lg:w-1/3 md:w-3/4 sm:w-full smxl:w-3/4 w-full flex flex-col gap-6">
                    <h3 className="font-semibold text-lg">Grand Ragu&apos; Star Meat and Mushrooms Sauce (2x180g)</h3>
                    <div className="flex flex-row gap-8 items-center">
                        <div>
                            <span className="font-semibold text-xl">£5.20</span>
                            <span> / </span>
                            <span className="text-sm">KG</span>
                        </div>
                        <div>
                            <span>VAT 22%</span>
                        </div>
                        <div>
                            <span className="font-semibold">3 UNITS</span>
                        </div>
                    </div>
                </div>
            </div>
            {widthPage < 1024 && <span className="w-full border-t-[1px] border-dashed border-neutral-500"/>}
            <div className="flex flex-col justify-center items-center">
                <span className="text-2xl font-semibold">£22.50</span>
            </div>
        </section>
    );
};

export default Product;