import React from 'react';
import Image from "next/legacy/image";
import CheeseImage from "../../../public/media/photos/shop/parmigiano-reggiano-cheese.jpg";
import PastaImage from "../../../public/media/photos/shop/pasta.webp";
import {useRouter} from "next/router";

const BestCategories = () => {
    const router = useRouter()

    const redirect = (query: string) => {
        router.push("/search?query=" + query)
    }

    return (
        <section className="flex flex-col gap-8">
            <h2 className="text-3xl text-center font-semibold leading-10 px-4">Browse Our Fantastic Products</h2>
            <div className="grid xls:grid-cols-2 sm:grid-cols-2 grid-cols-1 items-stretch">
                <div onClick={() => redirect("cheese and soft cheese")} className="relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Cheese</span>
                    </div>
                    <div className="-z-10 h-[550px]">
                        <Image alt="image" placeholder={"blur"} src={CheeseImage} className={"image !max-h-[400px] xls:!max-h-full"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
                <div onClick={() => redirect("pasta")} className="relative group cursor-pointer">
                    <div className="transition-all homepage-image z-10 group-hover:opacity-[35%]"/>
                    <div className="transition-all p-4 group-hover:bg-black opacity-80 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="text-5xl text-white font-navbar">Pasta</span>
                    </div>
                    <div className="-z-10 h-[550px]">
                        <Image alt="image" placeholder={"blur"} src={PastaImage} className={"image !max-h-[400px] xls:!max-h-full"} layout={"fill"} objectFit={"cover"} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestCategories;