import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import Counter from "../library/counter";

const ArticleList = () => {
    const [discount, setDiscount] = useState(true)
    const [itemNumber, setItemNumber] = useState(1)

    return (
        <article className="flex flex-col items-center justify-center gap-6 p-6 border-2 rounded-md border-neutral-400 relative">
            {discount &&
                <div className="absolute z-20 text-lg top-0 left-0 w-full p-2 bg-red-600 text-white text-center font-semibold">
                    <span>Save 50%</span>
                </div>
            }
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="shop-list w-full">
                    <Image quality={100} src={"/media/photos/shop/ragu_funghi_300x.webp"} alt="this is a photo" layout="fill" className={"image"}/>
                </div>
                {discount ?
                    <div className="flex flex-row gap-4 items-end">
                        <span className="font-semibold text-2xl">£ 5.80</span>
                        <span className="text-lg italic line-through text-red-600">£ 8.50</span>
                    </div>
                    :
                    <span className="font-semibold text-2xl">£ 8.50</span>
                }
                <span className="text-lg text-center">Grand Ragu&apos; Star Meat and Mushrooms Sauce (2x180g)</span>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <div className="hover:shadow-lg z-0 w-full border-2 rounded-lg border-black text-center text-white bg-green-standard hover:before:w-full before:bg-[#008c2e] button-animated">
                    <Link href={"/shop/1"}>
                        <a href="" className="relative block w-full p-3 text-lg  z-10">Check Product</a>
                    </Link>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="basis-1/5">
                        <Counter min={1} max={9}
                                 itemNumber={itemNumber} setItemNumber={setItemNumber}
                                 options={{fontText: "text-xl", sizeIcons: "text-xl", gap: "gap-3"}}
                        />
                    </div>
                    <div className="hover:before:w-full button-animated before:bg-orange-600 hover:shadow-lg z-0 grow border-2 rounded-lg border-black text-center text-white bg-orange-400 text-lg font-semibold basis-4/5">
                        <span className="cursor-pointer relative block p-3 z-10">Add to Cart</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleList;