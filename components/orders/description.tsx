import React, {ChangeEvent, useEffect, useRef} from 'react';
import {IoArrowDownCircle} from "react-icons/io5";
import {NextPage} from "next";
import {DateTime} from "luxon";
import {useAuth} from "../../contexts/auth-context";
import {OrderDeliveryType} from "../../pages/orders";

enum OrderStatus {
    CONFIRMED = "CONFIRMED",
    DELIVERED = "DELIVERED",
    REFUNDED = "REFUNDED"
}

type Props = {
    orderOpen: boolean
    setOrderOpen: React.Dispatch<React.SetStateAction<boolean>>
    modal: {
        setDeliveredModal: React.Dispatch<React.SetStateAction<boolean>>
        setRefundModal: React.Dispatch<React.SetStateAction<boolean>>
        setConfirmTimeslotModal: React.Dispatch<React.SetStateAction<boolean>>
    }
    order: {
        order_delivery: OrderDeliveryType
        status: string
        datetime: string
        price_total: number
        refund_total: number
    }
}

const Description: NextPage<Props> = ({orderOpen, setOrderOpen, order, modal}) => {
    const {isAdmin} = useAuth()
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

    const handleOrderOpenClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const elementClicked = e.target as HTMLElement
        console.log(elementClicked)
        try{
            if(!elementClicked.className.includes("no-event")) setOrderOpen(!orderOpen)
        }catch (e) {
            setOrderOpen(!orderOpen)
        }
    }

    const handleOrderStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        if(newValue === OrderStatus.DELIVERED){
            modal.setDeliveredModal(true)
        }else if(newValue === OrderStatus.REFUNDED){
            modal.setRefundModal(true)
        }
    }
    const handleSetTimeslotButtonClick = () => {
        modal.setConfirmTimeslotModal(true)
    }

    return (
        <>
            <div onClick={(e) => handleOrderOpenClick(e)} className="p-8 cursor-pointer w-full flex lg:flex-row flex-col gap-8 lg:gap-0 justify-between items-center">
                <div className="flex smxl:flex-row flex-col items-center gap-6">
                    {
                        isAdmin ?
                            <select value={order.status} onChange={(e) => handleOrderStatusChange(e)} className="no-event text-green-standard z-30 rounded-lg shadow-lg text-2xl font-semibold uppercase p-3">
                                {
                                    (order.status !== OrderStatus.REFUNDED || order.order_delivery.actual === null) &&
                                    <option className="no-event text-black text-lg" value={OrderStatus.DELIVERED}>DELIVERED</option>
                                }
                                <option className="no-event text-black text-lg" value={OrderStatus.REFUNDED}>REFUNDED</option>
                                {
                                    order.status === OrderStatus.CONFIRMED &&
                                    <option className="no-event text-black text-lg" value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                                }
                                {
                                    order.status === OrderStatus.REFUNDED &&
                                    <option className="no-event text-black text-lg" value={OrderStatus.REFUNDED}>NEW REFUND</option>
                                }
                            </select>
                            :
                            <span className="text-2xl font-semibold text-green-standard uppercase">{order.status}</span>
                    }
                    <span className="text-2xl smxl:block hidden"> - </span>
                    <span className="smxl:text-2xl text-lg">{DateTime.fromISO(order.datetime).toLocaleString(DateTime.DATETIME_SHORT)}</span>
                    {
                        (order.order_delivery.actual === null) &&
                        <button
                            onClick={handleSetTimeslotButtonClick}
                            className="no-event hover:bg-neutral-100 transition border-[1px] border-neutral-500 ml-4 p-3 text-center shadow-lg rounded-lg bg-white">
                            Delivery Range Period
                        </button>
                    }
                </div>
                <div className="flex flex-row items-center justify-center gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="space-x-4 flex flex-row items-center justify-center">
                            <span className="text-2xl">TOTAL</span>
                            <span className="text-2xl font-semibold text-green-standard">£{order.price_total.toFixed(2)}</span>
                        </div>
                        {
                            order.refund_total > 0 &&
                            <span className="text-red-600">{`£ ${order.refund_total.toFixed(2)} Refunded`}</span>
                        }
                    </div>
                    <div ref={circleRef} className="transition-all">
                        <IoArrowDownCircle className="text-4xl"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Description;