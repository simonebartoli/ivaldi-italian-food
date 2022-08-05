import React, {useEffect, useRef} from 'react';
import {IoArrowDownCircle} from "react-icons/io5";
import {NextPage} from "next";
import {DateTime} from "luxon";

type Props = {
    orderOpen: boolean
    setOrderOpen: React.Dispatch<React.SetStateAction<boolean>>
    order: {
        status: string
        datetime: string
        price_total: number
    }
}

const Description: NextPage<Props> = ({orderOpen, setOrderOpen, order}) => {
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
            <div className="flex flex-row gap-6">
                <span className="text-2xl font-semibold text-green-standard uppercase">{order.status}</span>
                <span className="text-2xl"> - </span>
                <span className="text-2xl">{DateTime.fromISO(order.datetime).toLocaleString(DateTime.DATETIME_SHORT)}</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
                <div className="space-x-4">
                    <span className="text-2xl">TOTAL</span>
                    <span className="text-2xl font-semibold text-green-standard">£{order.price_total.toFixed(2)}</span>
                </div>
                <div ref={circleRef} className="transition-all">
                    <IoArrowDownCircle className="text-4xl"/>
                </div>
            </div>
        </div>
    );
};

export default Description;