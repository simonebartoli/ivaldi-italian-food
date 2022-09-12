import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useAuth} from "../../../../contexts/auth-context";
import {gql, useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import Modal from "react-responsive-modal";
import Name from "./name";
import SubCategories from "./sub-categories";
import Buttons from "../../items/modal/buttons";
import {CategoryServerType, CategoryType} from "../../../../pages/categories";
import {NextPage} from "next";

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

type AddNewCategoryVarType = {
    data: {
        name: string
        subCategories: string[]
    }
}
type AddNewCategoryType = {
    addNewCategory: boolean
}
const ADD_NEW_CATEGORY = gql`
    mutation MODIFY_CATEGORY_DETAILS($data: AddNewCategoryInput!) {
        addNewCategory(data: $data)
    }
`

const AddForm: NextPage<Props> = ({category, modalOpen, currentProperty, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [loading, setLoading] = useState(false)
    const [reTry, setReTry] = useState(false)
    const optionToReTry = useRef<"MODIFY_DETAILS" | null>(null)

    const invalid = useMemo(() => {
        return currentProperty.value.name === null;
    }, [currentProperty])


    const [AddNewCategory] = useMutation<AddNewCategoryType, AddNewCategoryVarType>(ADD_NEW_CATEGORY, {
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
                optionToReTry.current = "MODIFY_DETAILS"
                setReTry(true)
                return
            }
            setLoading(false)
            toast.error(error.message)
        }
    })

    const handleFormSubmit = () => {
        setLoading(true)
        AddNewCategory({
            variables: {
                data: {
                    name: currentProperty.value.name!,
                    subCategories: currentProperty.value.sub_categories !== null ? currentProperty.value.sub_categories!.map(_ => _.name) : []
                }
            }
        })
    }

    useEffect(() => {
        if(reTry){
            AddNewCategory({
                variables: {
                    data: {
                        name: currentProperty.value.name!,
                        subCategories: currentProperty.value.sub_categories !== null ? currentProperty.value.sub_categories!.map(_ => _.name) : []
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
                <span className="text-center text-2xl">Add Category</span>
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

export default AddForm;