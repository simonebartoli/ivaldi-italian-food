import React, {useEffect, useRef, useState} from 'react';
import {FiPercent} from "react-icons/fi";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";
import {NextPage} from "next";
import {ItemType, ShippingCostType} from "../../pages/cart";
import {useAuth} from "../../contexts/auth-context";
import {useHoliday} from "../../contexts/holiday-context";

type Props = {
    items: Map<number, ItemType>
    minimumOrderPrice: number
    shippingCosts: ShippingCostType[]
}

const CartSummary: NextPage<Props> = ({items, minimumOrderPrice, shippingCosts}) => {
    const {logged} = useAuth()
    const {holidayPeriod} = useHoliday()

    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const [totalNoVatNoShipping, setTotalNoVatNoShipping] = useState(0)
    const [vat, setVat] = useState(0)
    const [shippingCost, setShippingCost] = useState(0)
    const [total, setTotal] = useState(0)
    const [numberOfItems, setNumberOfItems] = useState(0)
    const [totalDiscounts, setTotalDiscounts] = useState(0)

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.height = `calc(${heightPage}px - ${navHeight}px - 1.5rem - 2rem)`
        }
    }, [heightPage, navHeight])

    useEffect(() => {
        let totalNoVatNoShipping = 0
        let totalVat = 0
        let discounts = 0
        let numOfItems = 0
        let totalWeight = 0
        let totalShipping = 0

        for(const item of Array.from(items.values())){
            totalNoVatNoShipping += item.price_total * item.amount * (1 - (item.vat.percentage / 100))
            totalVat += item.price_total * item.amount * (item.vat.percentage / 100)
            totalWeight += item.weight * item.amount
            numOfItems += item.amount
            if(item.discount?.percentage !== undefined) discounts += (item.price_total / (1 - item.discount.percentage / 100) * item.amount) - item.price_total * item.amount
        }

        if(shippingCosts.length > 0){
            totalShipping = shippingCosts.filter(element => element.max_weight > totalWeight).sort((a, b) => a.max_weight > b.max_weight ? 1 : -1)[0].price
        }

        setShippingCost(totalShipping)
        setTotal(Number((totalVat + totalNoVatNoShipping + totalShipping).toFixed(2)))
        setVat(Number(totalVat.toFixed(2)))
        setTotalNoVatNoShipping(Number(totalNoVatNoShipping.toFixed(2)))
        setTotalDiscounts(Number(discounts.toFixed(2)))
        setNumberOfItems(numOfItems)
    }, [items, shippingCosts])

    return (
        <section ref={fullPageRef} className="lg:sticky top-[10%] flex flex-col gap-8 items-start justify-center basis-1/3 w-full smxl:p-6 p-0">
            <span className="text-center font-semibold text-2xl w-full">Cart Details</span>
            <div className="flex flex-col w-full gap-4 p-2 border-neutral-400 border-[1px] bg-neutral-100">
                <span className="text-xl">{numberOfItems} Total Item{numberOfItems > 0 && "s"}</span>
                <span className={"text-xl"}>{items.size} Different Article{items.size > 0 && "s"}</span>
            </div>
            <div className="flex flex-col gap-4">
                <span className="text-lg">Total (no VAT, no Shipping): <span className="text-2xl ">£ {totalNoVatNoShipping}</span></span>
                <span className="text-lg">Shipping Cost: <span>£ {shippingCost.toFixed(2)}</span></span>
                <span className="text-lg">VAT: <span>£ {vat.toFixed(2)}</span></span>
                <span className="text-xl">Total: <span className="text-2xl font-semibold text-green-standard">£ {total}</span></span>
            </div>
            {totalDiscounts > 0 &&
                <div className="flex flex-row gap-4 items-center text-lg text-red-500 font-semibold">
                    <FiPercent/>
                    <span>You Saved £ {totalDiscounts} with Discounts</span>
                </div>
            }
            {
                (total - shippingCost) >= minimumOrderPrice && minimumOrderPrice !== 0 && !holidayPeriod  ?
                    <Link href={!logged ? "/login?cart" : "/checkout"}>
                        <a href={!logged ? "/login?cart" : "/checkout"} className="font-semibold cursor-pointer w-full text-lg bg-green-standard hover:bg-green-500 transition rounded-lg shadow-lg p-4 text-white text-center">
                            Proceed To Checkout
                        </a>
                    </Link>
                    : holidayPeriod ?
                        <span className="text-red-600 text-center leading-8">This is an holiday period, there will be no deliveries in this time</span>
                    :   <span className="text-red-600 text-center leading-8">To Proceed to the checkout, your order needs to be at least £{minimumOrderPrice.toFixed(2)} (shipping excluded).</span>
            }
            {
                !logged &&
                <span className="w-full text-sm text-neutral-500 text-center">You need to register before continuing with the order.</span>
            }
        </section>
    );
};

export default CartSummary;