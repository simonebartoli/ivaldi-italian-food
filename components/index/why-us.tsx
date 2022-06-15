import React from 'react';
import Image from "next/image";
import PeoplePhoto from "../../public/media/photos/index/people.jpg";
import Link from "next/link";

const WhyUs = () => {
    return (
        <>
            <div className="lg:w-1/2 sm:w-3/4 smxl:w-5/6 w-full flex flex-col gap-12 items-center p-4">
                <h2 className="text-3xl text-center leading-10">Why <span className="text-red-600 font-semibold">Ivaldi </span><span className="text-green-standard font-semibold">Italian Food</span>?</h2>
                <p className="text-lg leading-10 text-justify">
                    Ivaldi is the name of this company and my family... <span className="font-semibold text-green-standard">a Sicilian family</span> emigrated
                    years ago to the UK for work <span className="font-semibold text-green-standard">that knows Italian food well</span> and knows how to recognize it from its copies produced all over the world.
                    Am I the largest food entrepreneur or importer in the UK? No... I would lie to you and myself first of all. But surely
                    <span className="font-semibold text-green-standard"> the food I sell is of the highest quality, and above all sold at an honest price</span>.
                    Don&apos;t believe it? <span className="text-green-standard font-semibold">Look at my shop</span> or if you want to ask
                    me for photos or videos and <span className="font-semibold text-green-standard">I will be happy to solve all your doubts</span>.
                </p>
                <div className="flex smxl:flex-row flex-col justify-evenly items-center sm:w-4/5 w-full smxl:gap-8 gap-4">
                    <Link href="/shop">
                        <a href="" className="w-full grow transition text-lg p-4 shadow-lg bg-green-500 hover:bg-green-standard rounded-lg text-white text-center">Look the Shop</a>
                    </Link>
                    <Link href="/contact">
                        <a href="" className="w-full grow transition text-lg p-4 shadow-lg bg-red-500 hover:bg-red-600 rounded-lg text-white text-center">Contact Me</a>
                    </Link>
                </div>
            </div>
            <div className="lg:w-1/2 sm:w-3/4 smxl:w-5/6 w-full sm:scale-75 people-photo">
                <Image alt="My Family" src={PeoplePhoto}/>
            </div>
        </>
    );
};

export default WhyUs;