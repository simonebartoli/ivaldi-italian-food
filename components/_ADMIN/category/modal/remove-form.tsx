import React, {useEffect, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import {useAuth} from "../../../../contexts/auth-context";
import {toast} from "react-toastify";
import Modal from "react-responsive-modal";
import Buttons from "../../items/modal/buttons";
import {CategoryServerType} from "../../../../pages/categories";
import {NextPage} from "next";

type Props = {
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    category: CategoryServerType
    refetch: any
}

type RemoveCategoryVarType = {
    category_id: number
}
type RemoveCategoryType = {
    removeCategory: boolean
}
const REMOVE_CATEGORY = gql`
    mutation REMOVE_CATEGORY($category_id: Int!){
        removeCategory(category_id: $category_id)
    }
`

const RemoveForm: NextPage<Props> = ({category, modalOpen, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)

    const [loading, setLoading] = useState(false)
    const handleFormSubmit = () => {
        setLoading(true)
        RemoveCategory({
            variables: {
                category_id: Number(category.category_id)
            }
        })
    }

    const [RemoveCategory] = useMutation<RemoveCategoryType, RemoveCategoryVarType>(REMOVE_CATEGORY, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
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
            RemoveCategory({
                variables: {
                    category_id: Number(category.category_id)
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
                    <span className="text-2xl">{`Are you sure you want to remove ${category.name} and all its subcategories?`}</span>
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