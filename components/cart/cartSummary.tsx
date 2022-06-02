import React, {useEffect, useRef} from 'react';
import {FiPercent} from "react-icons/fi";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";

const CartSummary = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.height = `calc(${heightPage}px - ${navHeight}px - 1.5rem - 2rem)`
        }
    }, [heightPage, navHeight])

    return (
        <section ref={fullPageRef} className="lg:sticky top-[10%] flex flex-col gap-8 items-start justify-center basis-1/3 w-full smxl:p-6 p-0">
            <span className="text-center font-semibold text-2xl w-full">Cart Details</span>
            <div className="flex flex-col w-full gap-4 p-2 border-neutral-400 border-[1px] bg-neutral-100">
                <span className="text-xl">55 Total Items</span>
                <span className={"text-xl"}>25 Different Articles</span>
            </div>
            <div className="flex flex-col gap-4">
                <span className="text-lg">Total (no VAT): <span className="text-2xl ">£ 80.65</span></span>
                <span className="text-lg">VAT: <span>£ 23.40</span></span>
                <span className="text-xl">Total (VAT included): <span className="text-2xl font-semibold text-green-standard">£ 105.80</span></span>
            </div>
            <div className="flex flex-row gap-4 items-center text-lg text-red-500 font-semibold">
                <FiPercent/>
                <span>You Saved £ 15.85 with Discounts</span>
            </div>
            <a href="" className="font-semibold cursor-pointer w-full text-lg bg-green-standard border-black border-2 rounded-lg shadow-lg p-4 text-white text-center">
                Proceed To Checkout
            </a>
        </section>
    );
};

export default CartSummary;