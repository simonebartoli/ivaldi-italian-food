import React, {useEffect, useRef, useState} from 'react';
import {FiPercent} from "react-icons/fi";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";
import {NextPage} from "next";
import {ItemType} from "../../pages/cart";
import {useAuth} from "../../contexts/auth-context";

type Props = {
    items: Map<number, ItemType>
}

const CartSummary: NextPage<Props> = ({items}) => {
    const {logged} = useAuth()

    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const [totalNoVat, setTotalNoVat] = useState(0)
    const [vat, setVat] = useState(0)
    const [total, setTotal] = useState(0)
    const [numberOfItems, setNumberOfItems] = useState(0)
    const [totalDiscounts, setTotalDiscounts] = useState(0)

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.height = `calc(${heightPage}px - ${navHeight}px - 1.5rem - 2rem)`
        }
    }, [heightPage, navHeight])

    useEffect(() => {
        let totalNoVat = 0
        let totalVat = 0
        let discounts = 0
        let numOfItems = 0

        for(const item of Array.from(items.values())){
            totalNoVat += item.price_total * item.amount * (1 - (item.vat.percentage / 100))
            totalVat += item.price_total * item.amount * (item.vat.percentage / 100)
            numOfItems += item.amount
            if(item.discount?.percentage !== undefined) discounts += item.price_total * item.amount * (item.discount.percentage / 100)
        }
        setTotal(Number((totalVat + totalNoVat).toFixed(2)))
        setVat(Number(totalVat.toFixed(2)))
        setTotalNoVat(Number(totalNoVat.toFixed(2)))
        setTotalDiscounts(Number(discounts.toFixed(2)))
        setNumberOfItems(numOfItems)
    }, [items])

    return (
        <section ref={fullPageRef} className="lg:sticky top-[10%] flex flex-col gap-8 items-start justify-center basis-1/3 w-full smxl:p-6 p-0">
            <span className="text-center font-semibold text-2xl w-full">Cart Details</span>
            <div className="flex flex-col w-full gap-4 p-2 border-neutral-400 border-[1px] bg-neutral-100">
                <span className="text-xl">{numberOfItems} Total Item{numberOfItems > 0 && "s"}</span>
                <span className={"text-xl"}>{items.size} Different Article{items.size > 0 && "s"}</span>
            </div>
            <div className="flex flex-col gap-4">
                <span className="text-lg">Total (no VAT): <span className="text-2xl ">£ {totalNoVat}</span></span>
                <span className="text-lg">VAT: <span>£ {vat}</span></span>
                <span className="text-xl">Total (VAT included): <span className="text-2xl font-semibold text-green-standard">£ {total}</span></span>
            </div>
            {totalDiscounts > 0 &&
                <div className="flex flex-row gap-4 items-center text-lg text-red-500 font-semibold">
                    <FiPercent/>
                    <span>You Saved £ {totalDiscounts} with Discounts</span>
                </div>
            }
            <Link href={!logged ? "/login?cart" : "/checkout"}>
                <a href={!logged ? "/login?cart" : "/checkout"} className="font-semibold cursor-pointer w-full text-lg bg-green-standard hover:bg-green-500 transition rounded-lg shadow-lg p-4 text-white text-center">
                    Proceed To Checkout
                </a>
            </Link>
            {
                !logged &&
                <span className="w-full text-sm text-neutral-500 text-center">You need to register before continuing with the order.</span>
            }
        </section>
    );
};

export default CartSummary;