import React, {useEffect, useRef} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import ShippingAddressList from "../components/checkout/shipping-address-list";
import BillingAddressList from "../components/checkout/billing-address-list";

const Checkout = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const shippingSectionRef = useRef<HTMLDivElement>(null)
    const billingSectionRef = useRef<HTMLDivElement>(null)
    const checkoutSectionRef = useRef<HTMLDivElement>(null)

    const refs = useRef([shippingSectionRef, billingSectionRef, checkoutSectionRef])

    useEffect(() => {
        if(navHeight !== undefined && fullPageRef.current !== null){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [widthPage, heightPage])

    const moveNext = (oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if(disappearingSection !== null && appearingSection !== null){
            disappearingSection.classList.toggle("animate-slideLeft")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromRight")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideLeft")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromRight")
            }, 500)
        }
    }

    const moveBack = (oldRef: number, newRef: number) => {
        const disappearingSection = refs.current[oldRef].current
        const appearingSection = refs.current[newRef].current

        if(disappearingSection !== null && appearingSection !== null){
            disappearingSection.classList.toggle("animate-slideRight")
            appearingSection.classList.toggle("hidden")
            appearingSection.classList.toggle("animate-comeFromLeft")
            setTimeout(() => {
                disappearingSection.classList.toggle("hidden")
                disappearingSection.classList.remove("animate-slideRight")
                appearingSection.classList.remove("hidden")
                appearingSection.classList.remove("animate-comeFromLeft")
            }, 500)
        }
    }

    return (
        <main ref={fullPageRef} className="overflow-x-hidden overflow-y-clip p-4 flex flex-row items-center justify-center">
            <ShippingAddressList ref={shippingSectionRef} moveNext={moveNext}/>
            <BillingAddressList ref={billingSectionRef} moveBack={moveBack} moveNext={moveNext}/>
        </main>
    );
};

export default Checkout;