import React, {useEffect, useRef} from 'react';
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import Final from "../components/checkout/final";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js";


const stripePromise = loadStripe('pk_test_51LHx5kILFxyKM1maBgbPWiLi1fcn545wLVdmeOUhX62ddzSoBUdLJ53yB2u9LNYdo9upTw7IdCe2nIlNyinYvubC00zipLMrxk');

const Checkout = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {widthPage, heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    const shippingSectionRef = useRef<HTMLDivElement>(null)
    const billingSectionRef = useRef<HTMLDivElement>(null)
    const deliveryInfoSectionRef = useRef<HTMLDivElement>(null)
    const finalSectionRef = useRef<HTMLDivElement>(null)

    const refs = useRef([shippingSectionRef, billingSectionRef, deliveryInfoSectionRef])

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


    const options: StripeElementsOptions = {
        // passing the client secret obtained from the server
        clientSecret: "pi_3LII25ILFxyKM1ma1tqDxaax_secret_zVJSdIDYr7aa8Jsc6ZQbHP1ZW",
        appearance: {
            theme: 'flat',
            variables: {
                spacingUnit: "5px",
                spacingGridRow: "20px",
                spacingGridColumn: "20px",
                spacingTab: "20px"
            }
        }
    };

    return (
        <main ref={fullPageRef} className="overflow-x-hidden overflow-y-clip p-4 flex flex-row items-center justify-center">
            {/*<ShippingAddressList ref={shippingSectionRef} moveNext={moveNext}/>*/}
            {/*<BillingAddressList ref={billingSectionRef} moveBack={moveBack} moveNext={moveNext}/>*/}
            {/*<DeliveryInfo ref={deliveryInfoSectionRef} moveBack={moveBack} moveNext={moveNext}/>*/}
            <Elements stripe={stripePromise} options={options}>
                <Final ref={finalSectionRef} moveBack={moveBack} moveNext={moveNext}/>
            </Elements>
        </main>
    );
};

export default Checkout;