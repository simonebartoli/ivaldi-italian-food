import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {IoSearchSharp} from "react-icons/io5";
import {FiShoppingCart} from "react-icons/fi";
import useBlurData from "use-next-blurhash";

const ArticleList = () => {
    const [ready, setReady] = useState(false)
    const [blurDataUrl] = useBlurData("L%Nc$qbb_4V@NHaeoKf+xvj[WAWU")
    const [discount, setDiscount] = useState(true)

    useEffect(() => setReady(true), [])

    return (
        <article className="flex flex-col items-center justify-center gap-6 p-6 relative border-b-[1px] border-neutral-400">
            {discount &&
                <div className="absolute z-20 text-lg top-0 left-1/2 -translate-x-1/2 w-5/6 p-1 bg-red-600 text-white text-center font-semibold">
                    <span>Save 50%</span>
                </div>
            }
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="shop-list w-full">
                    {ready &&
                        <Image  quality={100} src={"/media/photos/shop/ragu_funghi_300x.webp"}
                                      alt="this is a photo" layout="fill" className={"image"}
                                      placeholder="blur" blurDataURL={blurDataUrl}
                        />
                    }
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
                <Link href={"/shop/1"}>
                    <div className="cursor-pointer w-full p-2 flex flex-row gap-4 items-center justify-center bg-green-standard text-white rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href="">Check Product</a>
                        <IoSearchSharp/>
                    </div>
                </Link>
                <div className="flex flex-row gap-4">
                    <div className="basis-3/5 grow w-full p-2 flex flex-row gap-4 items-center justify-center bg-orange-400 text-neutral-100 rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href="">Add to Cart</a>
                        <FiShoppingCart/>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleList;