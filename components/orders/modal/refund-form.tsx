import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {useAuth} from "../../../contexts/auth-context";
import Buttons from "../../_ADMIN/items/modal/buttons";
import Modal from "react-responsive-modal";
import {NextPage} from "next";
import {ItemType, OrderType} from "../../../pages/orders";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";


type RefundType = {
    items_refunded: {
        item_id: number,
        name: string,
        amount_refunded: number,
        price_per_unit: number,
        price_total: number,
        taxes: number
    }[],
    notes: string | null
}
type Props = {
    order: OrderType
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    invalid: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
    refetch: any
}

type CreateRefundVarType = {
    data: {
        reference: string
        archive: RefundType["items_refunded"]
        notes: string
        shipping_cost: boolean
    }
}
type CreateRefundType = {createRefund: boolean}
const CREATE_REFUND = gql`
    mutation CREATE_REFUND ($data: CreateRefundInput!) {
        createRefund(data: $data)
    }
`

const RefundForm: NextPage<Props> = ({order, modalOpen, invalid, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)
    const [loading, setLoading] = useState(false)


    const [refundShippingCosts, setRefundShippingCosts] = useState(false)
    const [refundAll, setRefundAll] = useState(false)
    const [refund, setRefund] = useState<RefundType>({
        items_refunded: [],
        notes: null
    })
    const [refundManual, setRefundManual] = useState<RefundType["items_refunded"]>([])

    const total = useMemo(() => {
        let total = 0
        refund.items_refunded.forEach((element) => total += element.amount_refunded * element.price_per_unit)
        if(refundShippingCosts){
            total += order.shipping_cost
        }
        console.log(Number(total.toFixed(2)))
        return Number(total.toFixed(2))
    }, [refund, refundShippingCosts])

    const handleRefundAllOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked
        setRefundAll(newValue)

        if(newValue) {
            let items_refunded: RefundType["items_refunded"] = []
            if(order.refund === null){
                order.archive.items.forEach((element) => {
                    items_refunded.push({
                        item_id: element.item_id,
                        name: element.name,
                        amount_refunded: element.amount,
                        price_total: element.price_total,
                        price_per_unit: element.price_per_unit,
                        taxes: 0
                    })
                })
            }else{
                order.archive.items.forEach((element) => {
                    const amountMax = (() => {
                        let total = element.amount
                        order.refund!.map(_ => {
                            _.archive.forEach(__ => {
                                if(__.item_id === element.item_id){
                                    total -= __.amount_refunded
                                }
                            })
                        })
                        return total
                    })()
                    items_refunded.push({
                        item_id: element.item_id,
                        name: element.name,
                        amount_refunded: amountMax,
                        price_total: Number((element.price_per_unit * amountMax).toFixed(2)),
                        price_per_unit: element.price_per_unit,
                        taxes: 0
                    })
                })
            }
            setRefund({
                items_refunded: items_refunded,
                notes: refund.notes
            })
        }else{
            setRefund({
                items_refunded: refundManual,
                notes: refund.notes
            })
        }
    }
    const handleReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setRefund({
            items_refunded: refund.items_refunded,
            notes: newValue === "" ? null : newValue
        })
    }
    const handleFormSubmit = () => {
        setLoading(true)
        CreateRefund({
            variables: {
                data: {
                    reference: order.reference,
                    notes: refund.notes!,
                    archive: refund.items_refunded,
                    shipping_cost: refundShippingCosts
                }
            }
        })
    }

    const [CreateRefund] = useMutation<CreateRefundType, CreateRefundVarType>(CREATE_REFUND, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            refetch()
            modalOpen.set(false)
            setLoading(false)
            toast.success("Order Refunded")
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            toast.error(error.message)
            setLoading(false)
        }
    })

    useEffect(() => {
        setRefund({
            items_refunded: refundManual,
            notes: refund.notes
        })
    }, [refundManual])
    useEffect(() => {
        if(total > 0 && refund.notes !== null) invalid.set(false)
        else invalid.set(true)
    }, [total, refund])
    useEffect(() => {
        if(reTry){
            CreateRefund({
                variables: {
                    data: {
                        reference: order.reference,
                        notes: refund.notes!,
                        archive: refund.items_refunded,
                        shipping_cost: refundShippingCosts
                    }
                }
            })
            setReTry(false)
        }
    }, [reTry])

    return (
        <Modal open={modalOpen.value}
               onClose={() => {
                   modalOpen.set(false)
               }}
               center
               focusTrapped
               styles={{
                   modal: {
                       width: "80%",
                       margin: "0",
                       borderRadius: "5px"
                   }
               }}
               closeOnOverlayClick={false}
        >
            <div className="smxl:p-12 p-3 w-full flex flex-col items-center gap-16">
                <div className="flex flex-col gap-8 items-center justify-center w-full">
                    <span className="text-2xl">Refund Part / Total of the Order: </span>
                    <div className={`flex flex-col gap-8 items-center justify-center w-full ${refundAll && "pointer-events-none grayscale blur-[2px]"}`}>
                        {
                            order.archive.items.map((element) =>
                                <Product
                                    amount_refunded={(() => {
                                        let total = 0
                                        if(order.refund !== null){
                                            order.refund.forEach(_ => {
                                                _.archive.forEach(__ => {
                                                    if(__.item_id === element.item_id){
                                                        total += __.amount_refunded
                                                    }
                                                })
                                            })
                                        }
                                        return total
                                    })()}
                                    product={element}
                                    refundManual={refundManual}
                                    setRefundManual={setRefundManual}
                                    key={element.item_id}
                                />
                            )
                        }
                    </div>
                    <textarea
                        value={refund.notes !== null ? refund.notes : ""}
                        onChange={(e) => handleReasonChange(e)}
                        placeholder={"Insert the reason of the refund here..."}
                        className="p-3 w-full border-[1px] rounded-lg shadow-md resize-y"/>
                    <div className="flex flex-row items-center text-xl gap-8">
                        <span>Refund All Order: </span>
                        <input onChange={(e) => handleRefundAllOptionChange(e)} checked={refundAll} type="checkbox" className="scale-125"/>
                    </div>
                    {
                        !order.shipping_cost_refunded &&
                        <div className="flex flex-row items-center text-xl gap-8 my-6">
                            <span>Refund Shipping Cost: </span>
                            <input onChange={(e) => setRefundShippingCosts(e.target.checked)} checked={refundShippingCosts} type="checkbox" className="scale-125"/>
                        </div>
                    }
                    <div className="flex flex-row items-center text-2xl gap-8">
                        <span>Total Refund: </span>
                        <span className="text-red-600 text-3xl font-semibold">{`£ ${total.toFixed(2)}`}</span>
                    </div>
                    <span className="text-red-600 italic text-center">This action cannot be reverted, so be careful</span>
                </div>
                <Buttons
                    loading={loading}
                    setModalOpen={modalOpen.set}
                    invalid={invalid.value}
                    handleFormSubmit={handleFormSubmit}
                    type={"REFUNDED"}
                />
            </div>
        </Modal>
    );
};

type ProductProps = {
    product: ItemType
    amount_refunded: number
    refundManual: RefundType["items_refunded"]
    setRefundManual: React.Dispatch<React.SetStateAction<RefundType["items_refunded"]>>
}
const Product: NextPage<ProductProps> = ({product, refundManual, setRefundManual, amount_refunded}) => {
    const [amount, setAmount] = useState(0)

    const handleAmountRefundedChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value)
        setAmount(newValue)
        if(refundManual.map(_ => _.item_id).includes(product.item_id)) {
            if(newValue === 0) {
                setRefundManual(refundManual.filter(_ => _.item_id !== product.item_id))
            }else{
                const newRefund = refundManual.map((_) => {
                    if(_.item_id === product.item_id){
                        return {
                            ..._,
                            amount_refunded: newValue,
                            price_total: Number((newValue * _.price_per_unit).toFixed(2))
                        }
                    }else return _
                })
                setRefundManual(newRefund)
            }
        }else{
            setRefundManual([
                ...refundManual,
                {
                    item_id: product.item_id,
                    name: product.name,
                    amount_refunded: Number(newValue),
                    price_total: Number((product.price_per_unit * newValue).toFixed(2)),
                    price_per_unit: product.price_per_unit,
                    taxes: 0
                }
            ])
        }

    }
    return (
        <div className="flex sm:flex-row flex-col justify-between items-center w-full gap-8 bg-neutral-50 p-3 rounded-lg shadow-md">
            <div className="flex flex-col gap-2 sm:w-2/5 w-full">
                <span>{product.name}</span>
                <span>{`£ ${product.price_per_unit}/${product.price_unit} | ${product.amount} UNITS`}</span>
            </div>
            <select onChange={(e) => handleAmountRefundedChange(e)} value={amount} className="p-3 shadow-lg rounded-lg sm:w-auto w-full">
                <option value={0}>0</option>
                {
                    new Array(product.amount - amount_refunded).fill([]).map((element, index) =>
                        <option key={index} value={index+1}>{index+1}</option>
                    )
                }
            </select>
            <div className="flex flex-col gap-2 text-right w-full sm:w-auto">
                <span>Refund Product</span>
                <span className="text-red-600 font-semibold text-lg">{`£ ${(amount * product.price_per_unit).toFixed(2)}`}</span>
            </div>
        </div>
    )
}

export default RefundForm;