import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAuth} from "../../../contexts/auth-context";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import Modal from "react-responsive-modal";
import Buttons from "../../_ADMIN/items/modal/buttons";
import {NextPage} from "next";

type Props = {
    reference: string
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    refetch: any
}
type CreateTimeslotDeliveryVarType = {
    data: {
        reference: string
        timeslot: string
    }
}
type CreateTimeslotDeliveryType = {
    createTimeslotDelivery: boolean
}
const CREATE_TIMESLOT_DELIVERY = gql`
    mutation CREATE_TIMESLOT_DELIVERY($data: CreateTimeslotDeliveryInput!) {
        createTimeslotDelivery(data: $data)
    }
`

const TimeslotModal: NextPage<Props> = ({modalOpen, reference, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timeRange, setTimeRange] = useState<string | null>(null)

    const handleTimeRangeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setTimeRange(newValue.length === 0 ? null : newValue)
    }
    const handleFormSubmit = () => {
        setLoading(true)
        CreateTimeslotDelivery({
            variables: {
                data: {
                    reference: reference,
                    timeslot: timeRange!
                }
            }
        })
    }

    const [CreateTimeslotDelivery] = useMutation<CreateTimeslotDeliveryType, CreateTimeslotDeliveryVarType>(CREATE_TIMESLOT_DELIVERY, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("Timeslot Set")
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
            CreateTimeslotDelivery({
                variables: {
                    data: {
                        reference: reference,
                        timeslot: timeRange!
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
                    <span className="text-2xl">Timeslot to be Delivered: </span>
                    <textarea
                        value={timeRange !== null ? timeRange : ""}
                        onChange={(e) => handleTimeRangeChange(e)}
                        placeholder={"Insert the time range of the delivery..."}
                        className="p-3 w-full border-[1px] rounded-lg shadow-md resize-y"/>
                </div>
                <Buttons
                    loading={loading}
                    setModalOpen={modalOpen.set}
                    invalid={timeRange === null}
                    handleFormSubmit={handleFormSubmit}
                    type={"DELIVERED"}
                />
            </div>
        </Modal>
    )
};

export default TimeslotModal;