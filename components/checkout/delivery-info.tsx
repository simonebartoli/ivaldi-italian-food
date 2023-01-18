import React, {ChangeEvent, forwardRef, useEffect, useState} from 'react';
import PhoneInput, {formatPhoneNumberIntl, isValidPhoneNumber} from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import {E164Number} from "libphonenumber-js";
import {useResizer} from "../../contexts/resizer-context";

type Props = {
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void

    phoneNumber: {
        value: string,
        set: React.Dispatch<React.SetStateAction<string>>
    }
    deliveryInfo: {
        value: string,
        set: React.Dispatch<React.SetStateAction<string>>
    }

    setRenderCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

const DeliveryInfo = forwardRef<HTMLDivElement, Props>(({moveBack, moveNext, phoneNumber, deliveryInfo, setRenderCheckout}, ref) => {
    const {widthPage} = useResizer()

    const [disabled, setDisabled] = useState(true)
    const [errorDelivery, setErrorDelivery] = useState(false)
    const [errorPhone, setErrorPhone] = useState(true)

    useEffect(() => {
        if(isValidPhoneNumber(phoneNumber.value)) setErrorPhone(false)
        else setErrorPhone(true)
    }, [phoneNumber.value])

    useEffect(() => {
        if(errorPhone || errorDelivery) setDisabled(true)
        else setDisabled(false)
    }, [errorDelivery, errorPhone])

    const handleChangeDeliveryInfo = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        deliveryInfo.set(newValue)

        if(newValue.length > 100){
            setErrorDelivery(true)
        }else{
            setErrorDelivery(false)
        }
    }
    const handleNextButtonClick = () => {
        setRenderCheckout(true)
    }

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center xls:w-1/2 mdx:w-2/3 md:w-3/4 w-full gap-16 py-8">
            <section className="flex flex-col gap-14 items-center">
                <h2 className="text-3xl text-center">Insert Your Phone Number</h2>
                <span className="text-lg text-center leading-8">
                    Please insert your phone number.<br/> This number will be used to contact you during the delivery.
                </span>
                <div className="space-y-4">
                    {errorPhone && <span className="block w-full text-right text-red-600 italic">Your Phone Number is Not Valid</span>}
                    <PhoneInput

                        international={true}
                        defaultCountry="GB"
                        value={phoneNumber.value}
                        style={{
                            width: widthPage <= 640 ? `${widthPage - 48}px`: "auto"
                        }}
                        onChange={(value ) => {
                            const newValue = formatPhoneNumberIntl(value as E164Number)
                            if(newValue !== "") phoneNumber.set(newValue)
                            else if (value) phoneNumber.set(value)
                        }}
                        placeholder="Enter phone number"
                    />
                </div>
            </section>
            <span className="border-t-[1px] border-black w-full"/>
            <section className="flex flex-col gap-14 items-center w-full">
                <h2 className="text-3xl text-center">Your Delivery Preferences</h2>
                <section className="p-8 bg-neutral-100 rounded-lg w-full flex flex-col gap-6 shadow-lg">
                    <h3 className="text-xl">How Does Deliveries Works?</h3>
                    <p className="leading-8">
                        To deliver you the best experience possible, we deliver our products by hand at your most
                        suitable time slot. Our products are fresh and perishable, so they cannot be left in front of your house
                        door. You need to be present at the time of the delivery.<br/><br/>
                        After the order has been placed, we will contact you in a few hours (up to a maximum of 24 hours) to arrange
                        together the best time slot for the delivery. To speed up the process, please leave below your preferred timeslots
                        in the next days. Some items could take up to 3 days to arrive.
                    </p>
                </section>
                <div className="w-full space-y-4">
                    {errorDelivery && <span className="block w-full text-right text-red-600 italic">Your Message is too long</span>}
                    <textarea
                        value={deliveryInfo.value}
                        rows={5}
                        onChange={(e) => handleChangeDeliveryInfo(e)}
                        placeholder={"Insert your preferred time slots here..."}
                        className="w-full p-4 text-lg rounded-lg border-neutral-400 border-[1px] resize-none"
                    />
                </div>
            </section>
            <div className="mt-8 flex flex-row w-full justify-between items-center gap-8">
                <button onClick={() => moveBack(2, 1)} className="hover:bg-red-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-red-600">Back</button>
                <button disabled={disabled} onClick={handleNextButtonClick} className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-green-standard">Next</button>
            </div>
        </section>
    );
});

DeliveryInfo.displayName = "DeliveryInfo"
export default React.memo(DeliveryInfo);