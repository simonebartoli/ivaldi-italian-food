import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {IoSearchSharp} from "react-icons/io5";
import {FiShoppingCart} from "react-icons/fi";
import {NextPage} from "next";

type Item = {
    item_id: number
    name: string
    discount: {
        percentage: number
    } | null
    photo_loc: string
    amount_available: number
    price_total: number
}

const Article: NextPage<{item: Item, hidden?: boolean}> = ({item, hidden= false}) => {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setReady(true)
    }, [])

    return (
        <article className="flex flex-col items-center justify-center gap-6 smxl:p-6 p-0 relative border-b-[1px] border-neutral-400">
            {(item.discount !== null && item.amount_available > 0) &&
                <div className="absolute z-20 text-lg top-0 left-1/2 -translate-x-1/2 w-5/6 p-1 bg-red-600 text-white text-center font-semibold">
                    <span>Save {item.discount.percentage}%</span>
                </div>
            }
            {(item.amount_available === 0) &&
                <div className="absolute z-20 text-lg top-0 left-1/2 -translate-x-1/2 w-5/6 p-1 bg-neutral-400 text-neutral-100 text-center font-semibold">
                    <span>Out of Stock</span>
                </div>
            }
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="shop-list w-full">
                    {ready &&
                        <Image  quality={100} src={"/media/photos/shop/ragu_funghi_300x.webp"}
                                      alt="this is a photo" layout="fill" className={"image"}
                        />
                    }
                </div>
                {(item.discount && item.amount_available > 0) ?
                    <div className="flex flex-row gap-4 items-end">
                        <span className="font-semibold text-2xl">£ {item.price_total}</span>
                        <span className="text-lg italic line-through text-red-600">£ {Number(item.price_total * (item.discount.percentage / 100 + 1)).toFixed(2)}</span>
                    </div>
                    :
                    <span className="font-semibold text-2xl">£ {item.price_total}</span>
                }
                <span className="text-lg text-center">{item.name}</span>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <Link href={"/shop/" + item.item_id}>
                    <div className="cursor-pointer w-full p-2 flex flex-row gap-4 items-center justify-center bg-green-standard text-white rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href={"/shop/" + item.item_id}>Check Product</a>
                        <IoSearchSharp/>
                    </div>
                </Link>
                <div className="flex flex-row gap-4">
                    <button disabled={item.amount_available === 0} className="disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black basis-3/5 grow w-full p-2 flex flex-row gap-4 items-center justify-center bg-orange-400 text-neutral-100 rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        Add to Cart
                        <FiShoppingCart/>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default Article;