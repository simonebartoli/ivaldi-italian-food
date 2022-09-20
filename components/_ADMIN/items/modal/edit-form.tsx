import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css"
import {NextPage} from "next";
import Name from "./edit/name";
import Buttons from "./buttons";
import Description from "./edit/description";
import Price from "./edit/price";
import Stock from "./edit/stock";
import Discount from "./edit/discount";
import Keywords from "./edit/keywords";
import ImageUpload from "./edit/imageUpload";
import Category from "./edit/category";
import {ItemConverted} from "../../../../pages/items";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useAuth} from "../../../../contexts/auth-context";
import {toast} from "react-toastify";
enum OptionsEnum {
    NAME = "NAME",
    DESCRIPTION = "DESCRIPTION",
    PRICE = "PRICE",
    STOCK = "STOCK",
    DISCOUNT = "DISCOUNT",
    IMAGE = "IMAGE",
    CATEGORY = "CATEGORY",
    KEYWORDS = "KEYWORDS",
}
import "react-toastify/dist/ReactToastify.css"
import {API_HOST} from "../../../../settings";

type CurrentProduct = {
    name: string | null
    description: string | null
    price_total: number | null
    price_unit: string | null
    amount_available: number | null
    price_original: string | null
    vat: number | null
    image: File | null
    discount: string | null
    category: string[] | null
    keyword: string[] | null
}
type CreateSecureLinkType = {
    createSecureLink: string
}
type ModifyItemDetailsType = {
    modifyItemDetails: boolean
}
type ModifyItemDetailsVarType = {
    data: {
        item_id: number
        name?: string
        description?: string
        price_total?: number
        price_unit?: string
        amount_available?: number
        vat?: number
        photo_loc?: string
        discount?: number
        category?: string[]
        keyword?: string[]
    }
}

const CREATE_SECURE_LINK = gql`
    query CREATE_SECURE_LINK {
        createSecureLink
    }
`
const MODIFY_ITEM_DETAILS = gql`
    mutation MODIFY_ITEM_DETAILS($data: ModifyItemDetailsInput!) {
        modifyItemDetails(data: $data)
    }
`

type Props = {
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    item: ItemConverted
    refetch: any
}
const EditForm: NextPage<Props> = ({modalOpen, item, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()

    const [loading, setLoading] = useState(false)
    const optionToReTry = useRef<"IMAGE_UPLOAD" | "MODIFY_DETAILS" | null>(null)
    const [reTry, setReTry] = useState(false)

    const [optionSelected, setOptionSelected] = useState<OptionsEnum>()
    const [currentProperty, setCurrentProperty] = useState<CurrentProduct>({
        name: null,
        description: null,
        discount: null,
        image: null,
        price_original: null,
        price_total: null,
        price_unit: null,
        amount_available: null,
        vat: null,
        category: null,
        keyword: null
    })
    const [invalid, setInvalid] = useState(false)
    const photo_loc = useRef<string | null>(null)
    const resolveRef = useRef<((value: unknown) => void) | null>(null)
    const rejectRef = useRef<((value: unknown) => void) | null>(null)

    const delay = () => {
        return new Promise((resolve, reject) => {
            resolveRef.current = resolve
            rejectRef.current = reject
        })
    }
    const price_original = currentProperty["price_original"]
    const vat = currentProperty["vat"]
    const discount = currentProperty["discount"]
    const itemPriceOriginal = item.price_total / ((1 + item.vat.percentage/100) * (1 - (item.discount !== null ? item.discount.percentage : 0)/100))


    const handleOptionSelectorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setOptionSelected(OptionsEnum[e.target.value as keyof typeof OptionsEnum])
    }
    const uploadImage = async (token: string) => {
        const url = API_HOST + "/api/upload/" + token
        const body = new FormData()
        body.append("image", currentProperty["image"] as File)
        let result

        try {
            result = await fetch(url, {
                cache: "no-cache",
                mode: "cors",
                body: body,
                method: "POST"
            })
            result = await result.json()
            photo_loc.current = result.message
            resolveRef.current!("OK")
        }catch (e) {
            console.log(e)
            toast.error((e as Error).message)
            rejectRef.current!("ERROR")
        }
    }
    const handleFormSubmit = async () => {
        setLoading(true)
        photo_loc.current = null
        if(currentProperty["image"] !== null){
            CreateSecureLink({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
            try{
                await delay()
            }catch (e) {
                setLoading(false)
                return
            }
        }
        ModifyItemDetails({
            variables: {
                data: {
                    item_id: item.item_id,
                    name: currentProperty["name"] !== null ? currentProperty["name"] : undefined,
                    description: currentProperty["description"] !== null ? currentProperty["description"] : undefined,
                    discount: currentProperty["discount"] !== null ? Number(currentProperty["discount"]) : undefined,
                    vat: currentProperty["vat"] !== null ? currentProperty["vat"] : undefined,
                    price_total: currentProperty["price_total"] !== null ? currentProperty["price_total"] : undefined,
                    price_unit: currentProperty["price_unit"] !== null ? currentProperty["price_unit"] : undefined,
                    category: currentProperty["category"] !== null ? currentProperty["category"] : undefined,
                    keyword: currentProperty["keyword"] !== null ? currentProperty["keyword"] : undefined,
                    photo_loc: photo_loc.current !== null ? photo_loc.current : undefined,
                    amount_available: currentProperty["amount_available"] !== null ? currentProperty["amount_available"] : undefined
                }
            }
        })
    }


    const [CreateSecureLink] = useLazyQuery<CreateSecureLinkType>(CREATE_SECURE_LINK, {
        fetchPolicy: "network-only",
        onCompleted: async (data) => {
            await uploadImage(data.createSecureLink)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                optionToReTry.current = "IMAGE_UPLOAD"
                setReTry(true)
                return
            }
            toast.error(error.message)
        }
    })
    const [ModifyItemDetails] = useMutation<ModifyItemDetailsType, ModifyItemDetailsVarType>(MODIFY_ITEM_DETAILS, {
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

    useEffect(() => {

        const newPriceTotal = (
            (price_original !== null ? Number(price_original) : itemPriceOriginal) *
            (1 + (vat !== null ? vat as number : item.vat.percentage)/100) *
            (1 - (discount !== null ? Number(discount) : (item.discount !== null ? item.discount.percentage : 0))/100)
        )
        if(price_original !== null || vat !== null || discount !== null){
            setCurrentProperty({
                ...currentProperty,
                price_total: Number(newPriceTotal.toFixed(2))
            })
        }
    }, [price_original, vat, discount])
    useEffect(() => {
        if(reTry){
            if(optionToReTry.current === "IMAGE_UPLOAD"){
                CreateSecureLink({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token,
                        }
                    }
                })
            }else if (optionToReTry.current === "MODIFY_DETAILS"){
                ModifyItemDetails({
                    variables: {
                        data: {
                            item_id: item.item_id,
                            name: currentProperty["name"] !== null ? currentProperty["name"] as string : undefined,
                            description: currentProperty["description"] !== null ? currentProperty["description"] as string : undefined,
                            discount: currentProperty["discount"] !== null ? Number(currentProperty["discount"]) : undefined,
                            vat: currentProperty["vat"] !== null ? currentProperty["vat"] as number : undefined,
                            price_total: currentProperty["price_total"] !== null ? currentProperty["price_total"] as number : undefined,
                            price_unit: currentProperty["price_unit"] !== null ? currentProperty["price_unit"] as string : undefined,
                            category: currentProperty["category"] !== null ? currentProperty["category"] as string[] : undefined,
                            keyword: currentProperty["keyword"] !== null ? currentProperty["keyword"] as string[] : undefined,
                            photo_loc: photo_loc.current !== null ? photo_loc.current : undefined,
                            amount_available: currentProperty["amount_available"] !== null ? currentProperty["amount_available"] as number : undefined
                        }
                    }
                })
            }

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
                <span className="w-full text-lg">Select what you want to edit: </span>
                <select
                    disabled={invalid}
                    onChange={(e) => handleOptionSelectorChange(e)}
                    className="disabled:bg-neutral-500 disabled:cursor-not-allowed w-full text-xl p-3 rounded-lg">

                    <option selected>Select an Option...</option>
                    <option value={OptionsEnum.NAME}>Name</option>
                    <option value={OptionsEnum.DESCRIPTION}>Description</option>
                    <option value={OptionsEnum.PRICE}>Price & Vat</option>
                    <option value={OptionsEnum.STOCK}>Stock Unit</option>
                    <option value={OptionsEnum.DISCOUNT}>Discounts</option>
                    <option value={OptionsEnum.IMAGE}>Image</option>
                    <option value={OptionsEnum.CATEGORY}>Category</option>
                    <option value={OptionsEnum.KEYWORDS}>Keywords</option>
                </select>
                {
                    optionSelected && (
                        optionSelected as OptionsEnum === OptionsEnum.NAME ?
                            <Name
                                item={{name: item.name}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.DESCRIPTION ?
                            <Description
                                item={{description: item.description}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.PRICE ?
                            <Price
                                item={{
                                    price_total: item.price_total,
                                    price_unit: item.price_unit,
                                    vat: item.vat.percentage,
                                    discount: item.discount ? item.discount.percentage : 0
                                }}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.STOCK ?
                            <Stock
                                item={{amount_available: item.amount_available}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.DISCOUNT ?
                            <Discount
                                item={{price_total: item.price_total, discount: item.discount !== null ? item.discount.percentage : null}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.IMAGE ?
                            <ImageUpload
                                item={{photo_loc: item.photo_loc}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.KEYWORDS ?
                            <Keywords
                                item={{keywords: item.keywords}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                            /> :
                        optionSelected as OptionsEnum === OptionsEnum.CATEGORY &&
                            <Category
                                item={{category: item.category}}
                                currentProperty={{
                                    value: currentProperty,
                                    set: setCurrentProperty
                                }}
                                invalid={{
                                    value: invalid,
                                    set: setInvalid
                                }}
                            />
                    )
                }
                <Buttons invalid={invalid}
                         currentProperty={currentProperty}
                         setModalOpen={modalOpen.set}
                         handleFormSubmit={handleFormSubmit}
                         loading={loading}
                         type={"EDIT"}
                />
            </div>
        </Modal>
    );
};

export default EditForm;
export type {CurrentProduct}