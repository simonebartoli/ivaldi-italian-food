import React from 'react';
import Image from "next/image";
import MozzarellaImage from "../../public/media/photos/shop/mozzarella.jpg";
import PastaImage from "../../public/media/photos/shop/pasta.jpg";
import HamImage from "../../public/media/photos/shop/ham.jpg";
import BreadImage from "../../public/media/photos/shop/bread.jpg";

const BestCategories = () => {
    return (
        <section className="flex flex-col gap-8">
            <h2 className="text-3xl text-center font-semibold">Browse Our Fantastic Products</h2>
            <div className="flex flex-row items-stretch justify-items-stretch">
                <div className="basis-1/4 relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Mozzarella</span>
                    </div>
                    <div className="-z-10 shop-list">
                        <Image alt="image" placeholder={"blur"} src={MozzarellaImage} className={"image"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
                <div className="basis-1/4 relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Pasta</span>
                    </div>
                    <div className="-z-10 shop-list">
                        <Image alt="image" placeholder={"blur"} src={PastaImage} className={"image"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
                <div className="basis-1/4 relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Charcuterie</span>
                    </div>
                    <div className="-z-10 shop-list">
                        <Image alt="image" placeholder={"blur"} src={HamImage} className={"image"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
                <div className="basis-1/4 relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Bread</span>
                    </div>
                    <div className="-z-10 shop-list">
                        <Image alt="image" placeholder={"blur"} src={BreadImage} className={"image"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestCategories;