import React, {useState} from 'react';
import {MdArrowForwardIos} from "react-icons/md";
import Product from "../../orders/product";
import {NextPage} from "next";

type Item = {
    name: string
    photo_loc: string
    price_total: number
    price_unit: string
    price_per_unit: number
    vat: number
}
type ItemReact = Item & {item_id: number, amount: number}

type Props = {
    items: ItemReact[]
}

const Items: NextPage<Props> = ({items}) => {
    const [showProductsList, setShowProductsList] = useState(false)

    return (
        <div className="bg-neutral-100 rounded-lg p-8 flex flex-col gap-8 md:w-[125%] w-full">
            <div onClick={() => setShowProductsList(!showProductsList)} className="cursor-pointer flex flex-row gap-8 justify-center items-center">
                <span className="text-2xl text-center">Show Products</span>
                <MdArrowForwardIos style={{transform: showProductsList ? "rotate(270deg)" : undefined}} className="mt-1 text-2xl rotate-90"/>
            </div>
            {
                showProductsList &&
                <div className="flex flex-col items-center justify-center gap-8">
                    {items.map((element) =>
                        <Product item={element} key={element.item_id}/>
                    )}
                </div>
            }
        </div>
    );
};

export default Items;