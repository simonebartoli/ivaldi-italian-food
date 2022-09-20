import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Modal from "react-responsive-modal";
import {NextPage} from "next";
import "react-toastify/dist/ReactToastify.css"
import Buttons from "../../_ADMIN/items/modal/buttons";
import {useAuth} from "../../../contexts/auth-context";
import "react-responsive-modal/styles.css"
import {DateTime} from "luxon";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";

type Props = {
    reference: string
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    refetch: any
}
type ConfirmDeliveryVarType = {
    data: {
        reference: string
        datetime: Date
    }
}
type ConfirmDeliveryType = {
    confirmDelivery: boolean
}
const CONFIRM_DELIVERY = gql`
    mutation CONFIRM_DELIVERY($data: ConfirmDeliveryInput!) {
        confirmDelivery(data: $data)
    }
`

const DeliveredForm: NextPage<Props> = ({modalOpen, reference, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)
    const [loading, setLoading] = useState(false)

    const [date, setDate] = useState(DateTime.now().toISODate())
    const [time, setTime] = useState(DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE))
    const datetime = useRef<Date>(DateTime.now().toJSDate())

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value)
    }
    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(DateTime.fromISO(e.target.value) < DateTime.now())
            setTime(e.target.value)
    }

    const handleFormSubmit = () => {
        setLoading(true)
        datetime.current = DateTime.fromFormat(date + " " + time, "yyyy-MM-dd T").toJSDate()
        ConfirmDelivery({
            variables: {
                data: {
                    reference: reference,
                    datetime: datetime.current
                }
            }
        })
    }


    const [ConfirmDelivery] = useMutation<ConfirmDeliveryType, ConfirmDeliveryVarType>(CONFIRM_DELIVERY, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("Delivery Confirmed")
            refetch()
            modalOpen.set(false)
            setLoading(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            setLoading(false)
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if(reTry){
            ConfirmDelivery({
                variables: {
                    data: {
                        reference: reference,
                        datetime: datetime.current
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
                    <span className="text-2xl">Timeslot Delivered: </span>
                    <div className="flex sm:flex-row flex-col justify-between items-center w-full gap-8">
                        <input onChange={(e) => handleDateChange(e)} max={DateTime.now().toISODate()} value={date} className="border-[1px] border-neutral-500 rounded-lg p-3 shadow-lg sm:w-2/3 w-full" type="date"/>
                        <input onChange={(e) => handleTimeChange(e)} max={DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE)} value={time} className="border-[1px] border-neutral-500 rounded-lg p-3 shadow-lg sm:w-1/3 w-full" type="time"/>
                    </div>
                    <span className="text-red-600 italic text-center">This action cannot be reverted, so be careful</span>
                </div>
                <Buttons
                    loading={loading}
                    setModalOpen={modalOpen.set}
                    invalid={false}
                    handleFormSubmit={handleFormSubmit}
                    type={"DELIVERED"}
                />
            </div>
        </Modal>
    );
};

export default DeliveredForm;