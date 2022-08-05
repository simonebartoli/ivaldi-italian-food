import React, {useEffect, useRef} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import Image from "next/image";
import ConfirmImage from "../public/media/photos/checkout/confirm.svg"
import {useCart} from "../contexts/cart-context";
import {useAuth} from "../contexts/auth-context";

const Confirmation = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const {logged, loading} = useAuth()
    const {functions: {updateCart}} = useCart()

    useEffect(() => {
        if(!loading && logged) updateCart()
    }, [logged, loading])

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [widthPage, heightPage, navHeight])

    return (
        <main ref={fullPageRef} className="w-full flex flex-col items-center justify-center">
            <div className="mb-12">
                <Image alt="Confirmation Icon" src={ConfirmImage}/>
            </div>
            <h1 className="text-5xl text-green-standard font-semibold mb-16">Your Order Has Been Received</h1>
            <span className="text-2xl mb-12">We are happy to say that your order has been received 🎉</span>
            <div className="p-8 shadow-lg rounded-lg bg-neutral-100">
                <h2 className="mb-6 text-2xl font-semibold">And Now?...</h2>
                <span className="leading-8 text-lg">
                    You will receive an email in few hours, to plan together the best timeslot for
                    your order delivery. <br/> In the meanwhile you can revise your order here.
                </span>
            </div>
        </main>
    );
};

export default Confirmation;