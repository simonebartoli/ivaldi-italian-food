import React, {useEffect, useState} from 'react';
import Buttons from "./buttons";
import Modal from "react-responsive-modal";
import {ItemConverted} from "../../../../pages/items";
import {NextPage} from "next";
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../../../contexts/auth-context";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

type Props = {
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    item: ItemConverted
    refetch: any
}

type RemoveItemVarType = {
    item_id: number
}
type RemoveItemType = {
    removeItem: boolean
}
const REMOVE_ITEM = gql`
    mutation REMOVE_ITEM($item_id: Int!){
        removeItem(item_id: $item_id)
    }
`

const RemoveForm: NextPage<Props> = ({item, modalOpen, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [loading, setLoading] = useState(false)
    const handleFormSubmit = () => {
        setLoading(true)
        RemoveItem({
            variables: {
                item_id: item.item_id
            }
        })
    }

    const [RemoveItem] = useMutation<RemoveItemType, RemoveItemVarType>(REMOVE_ITEM, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("The Item Has Been Removed")
            setLoading(false)
            modalOpen.set(false)
            refetch()
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
            RemoveItem({
                variables: {
                    item_id: item.item_id
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
                <div className="flex flex-col gap-3 items-center justify-center">
                    <span className="text-2xl">{`Are you sure you want to remove ${item.name}?`}</span>
                    <span className="text-center text-red-600">This action is not reversible</span>
                </div>
                <Buttons
                    loading={loading}
                    setModalOpen={modalOpen.set}
                    invalid={false}
                    handleFormSubmit={handleFormSubmit}
                    type={"REMOVE"}
                />
            </div>
        </Modal>
    );
};

export default RemoveForm;