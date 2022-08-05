import React from 'react';
import Image from "next/image";
import {useResizer} from "../../contexts/resizer-context";
import {NextPage} from "next";

type Item = {
    name: string
    photo_loc: string
    price_total: number
    price_per_unit: number
    price_unit: string
    vat: number
}
type ItemReact = Item & {item_id: number, amount: number}

type Props = {
    item: ItemReact
}

const Product: NextPage<Props> = ({item}) => {
    const {widthPage} = useResizer()

    return (
        <section className="flex lg:flex-row gap-6 lg:gap-0 flex-col items-center justify-between w-full bg-white smx:p-6 px-4 py-6 rounded-lg">
            <div className="flex md:flex-row sm:flex-col smxl:flex-row flex-col gap-8 items-center">
                <div className="relative md:w-1/4 sm:w-1/2 smxl:w-1/4 smx:w-1/2 w-3/4 h-full shop-list">
                    <Image src="/media/photos/shop/ragu_funghi_300x.png" layout="fill" objectFit="contain" className="image"/>
                </div>
                <div className="lg:w-3/5 md:w-3/4 sm:w-full smxl:w-3/4 w-full flex flex-col gap-6">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex flex-row gap-8 items-center">
                        <div>
                            <span className="font-semibold text-xl">£{item.price_per_unit.toFixed(2)}</span>
                            <span> / </span>
                            <span className="text-sm">{item.price_unit}</span>
                        </div>
                        <div>
                            <span>VAT {item.vat}%</span>
                        </div>
                        <div>
                            <span className="font-semibold">{item.amount} UNITS</span>
                        </div>
                    </div>
                </div>
            </div>
            {widthPage < 1024 && <span className="w-full border-t-[1px] border-dashed border-neutral-500"/>}
            <div className="flex flex-col justify-center items-center">
                <span className="text-2xl font-semibold">£{item.price_total.toFixed(2)}</span>
            </div>
        </section>
    );
};

export default Product;