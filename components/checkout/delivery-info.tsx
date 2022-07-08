import React, {forwardRef, useEffect, useState} from 'react';
import PhoneInput, {formatPhoneNumberIntl, isPossiblePhoneNumber} from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import {E164Number} from "libphonenumber-js";

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void
}

const DeliveryInfo = forwardRef<HTMLDivElement, Props>(({moveBack, moveNext}, ref) => {
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>("")
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        if(isPossiblePhoneNumber(phoneNumber!)) setDisabled(false)
        else setDisabled(true)
    }, [phoneNumber])

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center w-1/2 gap-16 py-8">
            <section className="flex flex-col gap-14 items-center">
                <h2 className="text-3xl">Insert Your Phone Number</h2>
                <span className="text-lg text-center leading-8">
                    Please insert your phone number.<br/> This number will be used to contact you during the delivery.
                </span>
                <PhoneInput
                    international={true}
                    defaultCountry="GB"
                    value={phoneNumber}
                    onChange={(value ) => setPhoneNumber(formatPhoneNumberIntl(value as E164Number))}
                    placeholder="Enter phone number"
                />
            </section>
            <span className="border-t-[1px] border-black w-full"/>
            <section className="flex flex-col gap-14 items-center w-full">
                <h2 className="text-3xl">Your Delivery Preferences</h2>
                <section className="p-8 bg-neutral-100 rounded-lg w-full flex flex-col gap-6 shadow-lg">
                    <h3 className="text-xl">How Does Deliveries Works?</h3>
                    <p className="leading-8">
                        To deliver you the best experience possible, we deliver our products by hand at your most
                        suitable time slot. Our products are fresh and perishable, so they cannot be left in front of your house
                        door. You need to be present at the time of the delivery.<br/><br/>
                        After the order has been placed, we will contact you in a few hours (up to a maximum of 24 hours) to arrange
                        together the best time slot for the delivery. To speed up the process, please leave below your preferred timeslots
                        in the next days.
                    </p>
                </section>
                <textarea
                    placeholder={"Insert your preferred time slots here..."}
                    className="w-full p-4 text-lg rounded-lg border-neutral-400 border-[1px] resize-none"
                />
            </section>
            <div className="mt-8 flex flex-row w-full justify-between items-center gap-8">
                <button onClick={() => moveBack(2, 1)} className="hover:bg-red-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-red-600">Back</button>
                <button disabled={disabled} onClick={() => moveNext(2,3)} className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-green-standard">Next</button>
            </div>
        </section>
    );
});

DeliveryInfo.displayName = "DeliveryInfo"
export default DeliveryInfo;