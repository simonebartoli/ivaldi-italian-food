import React, {useEffect, useRef, useState} from 'react';
import {FiPercent} from "react-icons/fi";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";
import {NextPage} from "next";

type Props = {
    items: {
        price_total: number
        vat_percentage: number
        discount_percentage: number | undefined
        amount: number
    }[]
}

const CartSummary: NextPage<Props> = ({items}) => {
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

        for(const item of items){
            totalNoVat += item.price_total * (1 - (item.vat_percentage / 100))
            totalVat += item.price_total * (item.vat_percentage / 100)
            numOfItems += item.amount
            if(item.discount_percentage !== undefined) discounts += item.price_total * (item.discount_percentage / 100)
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
                <span className={"text-xl"}>{items.length} Different Article{items.length > 0 && "s"}</span>
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
            <Link href="/checkout">
                <a href={"/checkout"} className="font-semibold cursor-pointer w-full text-lg bg-green-standard border-black border-2 rounded-lg shadow-lg p-4 text-white text-center">
                    Proceed To Checkout
                </a>
            </Link>
        </section>
    );
};

export default CartSummary;