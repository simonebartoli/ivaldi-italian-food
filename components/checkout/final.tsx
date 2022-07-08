import React, {forwardRef} from 'react';
import CheckoutForm from "./checkoutForm";
import SavedCards from "./saved-cards";

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void
}

const Final = forwardRef<HTMLDivElement, Props>(({moveBack, moveNext}, ref) => {

    return (
        <section ref={ref} className="flex flex-col items-center justify-center w-1/2 gap-8 py-8">
            <h2 className="text-3xl">Checkout</h2>
            <div className="flex flex-col gap-4 w-full">
                <div className="w-full p-4 bg-neutral-100 rounded-lg flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <p>1 Yeo Street, Caspian Wharf 40, E33AE, London</p>
                </div>
                <div className="w-full p-4 bg-neutral-100 rounded-lg flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Billing Address</h3>
                    <p>Via Mammoli 38/d, 50013, Campi Bisenzio, Italy</p>
                </div>
            </div>
            <div className="p-4 flex flex-row gap-4 text-lg items-start w-full">
                <span className="font-semibold">Phone Number:</span>
                <span>+44 77 2309 3701</span>
            </div>
            <span className="w-full border-t-[1px] border-neutral-300"/>
            <div className="text-xl p-8 bg-neutral-100 rounded-lg flex flex-col w-full gap-8">
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-semibold">Total (no VAT):</span>
                    <span>£50.50</span>
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-semibold">VAT:</span>
                    <span>£10.20</span>
                </div>
                <span className="border-t-[1px] bg-neutral-500 w-full"/>
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-semibold text-3xl">Total (with VAT):</span>
                    <span className="text-3xl font-semibold">£60.70</span>
                </div>
            </div>
            <span className="w-full border-t-[1px] border-neutral-300"/>
            <SavedCards/>
            <span className="mt-4 w-full border-t-[1px] border-neutral-300"/>
            <CheckoutForm/>
        </section>
    );
});

Final.displayName = "Final"
export default Final;