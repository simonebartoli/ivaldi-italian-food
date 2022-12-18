import React from 'react';
import {AddressReactType} from "../../pages/checkout";
import {NextPage} from "next";
import {OrderDeliveryType, OrderType, RefundType} from "../../pages/orders";
import {DateTime} from "luxon";
import {useAuth} from "../../contexts/auth-context";

type Props = {
    summary: {
        user: OrderType["user"]
        status: string
        order_delivery: OrderDeliveryType
        reference: string
        shipping_address: AddressReactType
        shipping_cost_refunded: boolean
        shipping_total: number
        price_total: number
        vat_total: number
        refund: RefundType[] | null
    }
}

const Total: NextPage<Props> = ({summary}) => {
    const {isAdmin} = useAuth()

    return (
        <div className="flex flex-col bg-white p-6 w-full rounded-lg smxl:gap-6 gap-10">
            {
                summary.refund !== null &&
                summary.refund.map((_, index) =>
                    <React.Fragment key={index}>
                        <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                            <span className="text-xl text-green-standard font-semibold">DATE:</span>
                            <span className="text-xl font-semibold">
                                {DateTime.fromISO(_.datetime).toLocaleString(DateTime.DATETIME_SHORT)}
                            </span>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                            <span className="text-xl text-green-standard font-semibold">REFUND TOTAL:</span>
                            <span className="text-xl font-semibold">
                            {`£ ${(() => {
                                let total = 0
                                _.archive.forEach(__ => total += __.price_total)
                                return total.toFixed(2)
                            })()}`}
                            </span>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                            <span className="text-xl text-green-standard font-semibold">REASON:</span>
                            <span className="text-xl font-semibold">
                                {_.notes}
                            </span>
                        </div>
                        <hr className="w-full"/>
                    </React.Fragment>
                )
            }
            {
                isAdmin &&
                <>
                    <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                        <span className="text-xl text-green-standard font-semibold">USER:</span>
                        <span className="text-xl font-semibold">{`${summary.user.name} ${summary.user.surname} - ${summary.user.email}`}</span>
                    </div>
                    <hr className="w-full"/>
                </>
            }
            {
                summary.order_delivery.actual !== null ?
                <>
                    <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                        <span className="text-xl text-green-standard font-semibold">DELIVERED:</span>
                        <span className="text-xl font-semibold uppercase">{DateTime.fromISO(summary.order_delivery.actual).toLocaleString(DateTime.DATETIME_SHORT)}</span>
                    </div>
                    <hr className="w-full"/>
                </>
                    :
                summary.order_delivery.confirmed !== null ?
                <>
                    <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                        <span className="text-xl text-green-standard font-semibold">DELIVERY RANGE PERIOD:</span>
                        <span className="text-xl font-semibold">{summary.order_delivery.confirmed}</span>
                    </div>
                    <hr className="w-full"/>
                </>
                    :
                summary.order_delivery.suggested !== null &&
                <>
                    <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                        <span className="text-xl text-green-standard font-semibold">SUGGESTED PERIOD:</span>
                        <span className="text-xl font-semibold">{summary.order_delivery.suggested}</span>
                    </div>
                    <hr className="w-full"/>
                </>
            }
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">ORDER ID:</span>
                <span className="text-xl font-semibold uppercase">{summary.reference}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">SHIPPING ADDRESS:</span>
                <span className="text-xl font-semibold">
                    {summary.shipping_address.first_address},&nbsp;
                    {summary.shipping_address.second_address && summary.shipping_address.second_address + ","}&nbsp;
                    {summary.shipping_address.postcode},&nbsp;
                    {summary.shipping_address.city},&nbsp;
                    UK
                </span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">TOTAL (NO VAT, NO SHIPPING):</span>
                <span className="text-xl font-semibold">£{(summary.price_total - summary.vat_total - summary.shipping_total).toFixed(2)}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">VAT:</span>
                <span className="text-xl font-semibold">£{summary.vat_total.toFixed(2)}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start">
                <span className="text-xl text-green-standard font-semibold">SHIPPING COST {summary.shipping_cost_refunded && "(REFUNDED)"}:</span>
                <span className="text-xl font-semibold">£{summary.shipping_total.toFixed(2)}</span>
            </div>
            <div className="flex lg:flex-row flex-col gap-6 lg:items-center items-start pt-6 border-t-[1px] border-neutral-500 border-dashed">
                <span className="text-2xl text-green-standard font-semibold">TOTAL:</span>
                <span className="text-2xl font-semibold">£{(summary.price_total).toFixed(2)}</span>
            </div>
        </div>
    );
};


export default Total;