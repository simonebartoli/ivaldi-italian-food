import React, {useEffect, useRef} from 'react';
import {IoArrowDownCircle} from "react-icons/io5";
import {NextPage} from "next";
import {DateTime} from "luxon";

type Props = {
    orderOpen: boolean
    setOrderOpen: React.Dispatch<React.SetStateAction<boolean>>
    receipt: {
        receipt_number: number
        datetime: string
        price_total: number
        payment_method: {
            type: "CARD" | "PAYPAL"
            account: string
        }
        reference: string
    }
}

const Description: NextPage<Props> = ({orderOpen, setOrderOpen, receipt}) => {
    const circleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(circleRef.current !== null){
            if(orderOpen){
                circleRef.current.style.transform = "rotate(180deg)"
            }else{
                circleRef.current.style.transform = "rotate(0deg)"
            }
        }
    }, [orderOpen])

    const handleOrderOpenClick = () => {
        setOrderOpen(!orderOpen)
    }

    return (
        <div onClick={handleOrderOpenClick} className="p-8 cursor-pointer w-full flex lg:flex-row flex-col gap-8 lg:gap-0 justify-between items-center">
            <div className="flex mdx:flex-row flex-col mdx:gap-6 gap-4 items-center justify-center">
                <div className="flex flex-row gap-4 items-center justify-center">
                    <span className="text-xl uppercase">N.INVOICE</span>
                    <span className="font-semibold text-green-standard text-xl">
                        {String(receipt.receipt_number).padStart(7, "0")}
                    </span>
                </div>
                <span className="mdx:block hidden text-xl"> - </span>
                <span className="text-xl">{DateTime.fromISO(receipt.datetime).toLocaleString(DateTime.DATETIME_SHORT)}</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
                <div className="space-x-4">
                    <span className="text-xl">TOTAL</span>
                    <span className="text-xl font-semibold text-green-standard">£{receipt.price_total.toFixed(2)}</span>
                </div>
                <div ref={circleRef} className="transition-all">
                    <IoArrowDownCircle className="text-2xl"/>
                </div>
            </div>
        </div>
    );
};

export default Description;