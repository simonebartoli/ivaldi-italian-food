import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Counter from "../library/counter";
import {FaRegTrashAlt} from "react-icons/fa";
import {useResizer} from "../../contexts/resizer-context";
import {NextPage} from "next";
import {useCart} from "../../contexts/cart-context";

type ItemType = {
    item_id: number
    name: string
    price_total: number
    vat: {
        percentage: number
    }
    amount_available: number
    amount: number
    price_unit: string
    photo_loc: string
    discount: {
        percentage: number
    } | null
}

const CartArticle: NextPage<{item: ItemType }> = ({item: {
    item_id,
    name,
    price_unit,
    price_total,
    amount,
    amount_available,
    photo_loc,
    vat,
    discount
}}) => {
    const [number, setNumber] = useState(amount < amount_available ? amount : amount_available)
    const [ready, setReady] = useState(false)

    useEffect(() => {setReady(true)}, [])
    const {functions: {addToCart}} = useCart()
    const {widthPage} = useResizer()

    useEffect(() => {
        amount = number
        // addToCart(item_id, number)
    }, [number])

    return (
        <article className="flex smxl:flex-row flex-col gap-4 items-center w-full">
            <div className="shop-list relative smxl:w-1/2 w-full">
                <Image
                    alt="this is a photo" src={"/media/photos/shop/ragu_funghi_300x.webp"} layout={"fill"}
                    className="image"
                />
            </div>
            <div className="flex flex-row gap-8 items-center justify-around smxl:w-1/2 w-full">
                <div className="flex flex-col smxl:gap-10 gap-8 w-full">
                    <span className="text-lg">{name}</span>
                    <div className="flex flex-col gap-2">
                            <span className="text-lg">Price per {price_unit}:
                                <span className="text-2xl font-semibold"> £ {price_total}</span>
                            </span>
                        <span className="text-base"> (included VAT {vat.percentage}%)</span>
                    </div>
                    <div className="flex xlsx:flex-row flex-col smxl:gap-6 gap-10">
                        <div className="smxl:w-fit w-2/3 flex flex-row gap-8 items-center justify-between">
                            <Counter
                                min={1}
                                max={amount_available}
                                itemNumber={number}
                                setItemNumber={setNumber}
                                options={{fontText: "text-2xl", sizeIcons: "text-2xl"}}/>
                            {
                                ready && widthPage < 600 &&
                                <div>
                                    <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                                </div>
                            }
                        </div>
                        <span className="select-none text-2xl text-right smxl:text-left">
                                Total:
                                <span className="text-3xl font-semibold text-green-standard"> £ {(price_total*number).toFixed(2)}</span>
                            </span>
                    </div>
                </div>
                {
                    ready && widthPage >= 600 &&
                        <div>
                            <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                        </div>
                }

            </div>
        </article>
    );
};

export default CartArticle;