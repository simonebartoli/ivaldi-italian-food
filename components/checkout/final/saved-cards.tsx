import React from 'react';
import Image from "next/image";
import VisaImage from "../../../public/media/photos/checkout/visa.png";
import MastercardImage from "../../../public/media/photos/checkout/mastercard.png";
import AmericanImage from "../../../public/media/photos/checkout/american-express.png";

const SavedCards = () => {
    return (
        <div className="flex flex-col gap-6 w-full items-center justify-center">
            <h3 className="text-3xl my-6">Your Saved Cards</h3>
            <div className="w-full hover:bg-neutral-200 transition cursor-pointer p-6 bg-neutral-100 shadow-lg rounded-lg flex flex-row justify-between items-center">
                <div className="w-1/5 flex items-center justify-center">
                    <div className="relative h-[50px] w-full items-center justify-center flex">
                        <Image src={VisaImage} layout="fill" objectFit="contain"/>
                    </div>
                </div>
                <span className="text-2xl">XXXX XXXX XXXX 4242</span>
                <div className="text-2xl">
                    03/24
                </div>
            </div>
            <div className="w-full hover:bg-neutral-200 transition cursor-pointer p-6 bg-neutral-100 shadow-lg rounded-lg flex flex-row justify-between items-center">
                <div className="w-1/5 flex items-center justify-center">
                    <div className="relative w-full h-[50px] items-center justify-center flex">
                        <Image src={MastercardImage} layout={"fill"} objectFit={"contain"} className="w-full"/>
                    </div>
                </div>
                <span className="text-2xl">XXXX XXXX XXXX 4242</span>
                <div className="text-2xl">
                    03/24
                </div>
            </div>
            <div className="w-full hover:bg-neutral-200 transition cursor-pointer p-6 bg-neutral-100 shadow-lg rounded-lg flex flex-row justify-between items-center">
                <div className="w-1/5 flex items-center justify-center">
                    <div className="relative w-full h-[50px] items-center justify-center flex">
                        <Image src={AmericanImage} layout={"fill"} objectFit={"contain"} className="w-full"/>
                    </div>
                </div>
                <span className="text-2xl">XXXX XXXX XXXX 4242</span>
                <div className="text-2xl">
                    03/24
                </div>
            </div>
        </div>
    );
};

export default SavedCards;