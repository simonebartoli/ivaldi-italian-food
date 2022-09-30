import React from 'react';
import Image from "next/image";
import {NextPage} from "next";
import Link from "next/link";
import {API_HOST} from "../../../settings";

type Item = {
    item_id: number
    name: string
    price_total: number
    importance: number
    price_unit: string
    photo_loc: string
}

type Props = {
    items: Item[]
}

const SearchResults: NextPage<Props> = ({items}) => {

    return (
        <div className="bg-white cursor-pointer rounded-b-lg shadow-lg absolute mdxl:mt-2 mt-1 top-full left-0 w-full flex flex-col items-center justify-center">
            {items.map((item) =>
                <Link key={item.item_id} href={`/shop/${item.item_id}`}>
                    <div className="border-b-[1px] border-neutral-300 text-neutral-700 hover:text-black transition flex flex-row gap-8 items-center justify-start hover:bg-neutral-200 transition p-5 px-10 w-full">
                        <div className="w-[150px] flex items-center justify-center">
                            <div className="relative h-[100px] w-full items-center justify-center flex">
                                <Image src={`${API_HOST}${item.photo_loc}`} layout={"fill"} objectFit={"contain"}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 items-start justify-center w-2/3">
                            <span className="smxl:text-xl smx:text-lg text-base">{item.name}</span>
                            <span className="smxl:text-2xl smx:text-xl text-lg">£ {item.price_total}/
                            <span className="text-base">{item.price_unit}</span>
                        </span>
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default SearchResults;