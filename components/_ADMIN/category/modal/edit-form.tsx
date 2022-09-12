import React, {useEffect, useMemo, useState} from 'react';
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css"
import {NextPage} from "next";
import {CategoryServerType, CategoryType} from "../../../../pages/categories";
import Name from "./name";
import SubCategories from "./sub-categories";
import Buttons from "../../items/modal/buttons";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {useAuth} from "../../../../contexts/auth-context";
import "react-toastify/dist/ReactToastify.css"

type Props = {
    category: CategoryServerType
    currentProperty: {
        value: CategoryType
        set: React.Dispatch<React.SetStateAction<CategoryType>>
    }
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    refetch: any
}

type ModifyCategoryDetailsVarType = {
    data: {
        category_id: number
        name?: string
        subCategories?: string[]
    }
}
type ModifyCategoryDetailsType = {
    modifyCategoryDetails: boolean
}
const MODIFY_CATEGORY_DETAILS = gql`
    mutation MODIFY_CATEGORY_DETAILS($data: ModifyCategoryDetailsInput!) {
        modifyCategoryDetails(data: $data)
    }
`

const EditForm: NextPage<Props> = ({category, modalOpen, currentProperty, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [loading, setLoading] = useState(false)
    const [reTry, setReTry] = useState(false)

    const invalid = useMemo(() => {
        return currentProperty.value.name === null && currentProperty.value.sub_categories === null;
    }, [currentProperty])


    const [ModifyCategoryDetails] = useMutation<ModifyCategoryDetailsType, ModifyCategoryDetailsVarType>(MODIFY_CATEGORY_DETAILS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            setLoading(false)
            refetch()
            modalOpen.set(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                setReTry(true)
                return
            }
            setLoading(false)
            toast.error(error.message)
        }
    })

    const handleFormSubmit = () => {
        setLoading(true)
        ModifyCategoryDetails({
            variables: {
                data: {
                    category_id: Number(category.category_id),
                    name: currentProperty.value.name !== null ? currentProperty.value.name : undefined,
                    subCategories: currentProperty.value.sub_categories !== null ? currentProperty.value.sub_categories.map(_ => _.name) : undefined
                }
            }
        })
    }

    useEffect(() => {
        if(reTry){
            ModifyCategoryDetails({
                variables: {
                    data: {
                        category_id: Number(category.category_id),
                        name: currentProperty.value.name !== null ? currentProperty.value.name : undefined,
                        subCategories: currentProperty.value.sub_categories !== null ? currentProperty.value.sub_categories.map(_ => _.name) : undefined
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
            <div className="smxl:p-12 p-3 w-full flex flex-col items-center gap-8">
                <span className="text-center text-2xl">Edit Category</span>
                <Name
                    name={category.name}
                    currentProperty={{
                        value: currentProperty.value,
                        set: currentProperty.set
                    }}
                />
                <SubCategories
                    category={category}
                    currentProperty={{
                        value: currentProperty.value,
                        set: currentProperty.set
                    }}
                />
                <Buttons
                    handleFormSubmit={handleFormSubmit}
                    setModalOpen={modalOpen.set}
                    type={"CATEGORY"}
                    invalid={invalid}
                    loading={loading}
                />
            </div>
        </Modal>
    );
};

export default EditForm;