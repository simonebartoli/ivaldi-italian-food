import React from 'react';
import Image from "next/image";
import {IoSearchSharp} from "react-icons/io5";
import {FiShoppingCart} from "react-icons/fi";
import {ItemType} from "../list/homeSectionList";
import {NextPage} from "next";
import Link from "next/link";
import {Bars} from "react-loader-spinner";
import {API_HOST} from "../../../../settings";

type Props = {
    item: ItemType
    loading: boolean
    disabled: boolean
    handleAddToCartButtonClick: (item_id: number) => void
}

const HomeSection: NextPage<Props> = ({item, loading, disabled, handleAddToCartButtonClick}) => {
    return (
        <div className="h-full px-8 py-2 bg-neutral-50 w-full flex lg:flex-row flex-col items-center justify-evenly">
            {
                item.discount !== null &&
                <div className="lg:hidden block bg-white border-[1px] border-neutral-400 p-4 my-8 w-full sm:w-1/2">
                    <span className="w-full text-3xl text-center flex items-center flex-col gap-3">
                        Discount: <span className="w-full text-red-600 font-semibold">{`${item.discount.percentage}% OFF`}</span>
                    </span>
                </div>
            }
            <div className={`relative max-h-[500px] lg:h-full ${item.discount !== null ? "h-[300px]" : "h-[481px]"} lg:w-1/2 w-full grow`}>
                <Image priority={true} alt="photo" src={`${API_HOST}${item.photo_loc}`} layout="fill" objectFit="contain" className="rounded-lg"/>
            </div>
            <div className="flex flex-col basis-1/2 grow items-center justify-center gap-12 self-stretch py-6">
                {
                    item.discount !== null &&
                    <div className="lg:block hidden bg-white border-[1px] border-neutral-400 p-4">
                        <span className="text-3xl">
                            Discount: <span className="text-red-600 font-semibold">{`${item.discount.percentage}% OFF`}</span>
                        </span>
                    </div>
                }
                <span className="smxl:text-5xl text-3xl text-center leading-[3rem]">{item.name}</span>
                <div className="flex flex-row gap-12 items-center">
                    <span className="font-semibold text-3xl">{`£ ${item.price_total.toFixed(2)}`}</span>
                    {
                        item.discount !== null &&
                        <span className="font-semibold text-xl text-red-600 line-through">
                            {`£ ${(item.price_total / (1 - (item.discount !== null ? item.discount.percentage : 0) / 100)).toFixed(2)}`}
                        </span>
                    }
                </div>
                <div className="flex flex-col gap-4 sm:w-1/2 w-full">
                    <Link href={`/shop/${item.item_id}`}>
                        <div className="cursor-pointer p-2 flex flex-row gap-4 items-center justify-center bg-green-standard text-white rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                            <a href={`/shop/${item.item_id}`}>Check Product</a>
                            <IoSearchSharp/>
                        </div>
                    </Link>
                    <button onClick={() => handleAddToCartButtonClick(item.item_id)} disabled={item.amount_available === 0 || loading || disabled} className="disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black basis-3/5 grow w-full p-2 flex flex-row gap-4 items-center justify-center bg-orange-400 text-neutral-100 rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        {
                            loading ? <Bars height={24} color={"white"}/>
                                : <>Add to Cart <FiShoppingCart/></>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeSection;