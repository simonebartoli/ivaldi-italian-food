import React, {useEffect, useRef, useState} from 'react';
import Buttons from "./buttons";
import Modal from "react-responsive-modal";
import {NextPage} from "next";
import {useAuth} from "../../../../contexts/auth-context";
import "react-toastify/dist/ReactToastify.css"
import Name from "./add/name";
import Description from "./add/description";
import Vat from "./add/vat";
import Price from "./add/price";
import Discount from "./add/discount";
import ImageUpload from "./add/imageUpload";
import Stock from "./add/stock";
import Category from "./add/category";
import Keyword from "./add/keyword";
import {CurrentProduct} from "./edit-form";
import PriceUnit from "./add/price-unit";
import {API_HOST} from "../../../../settings";
import {toast} from "react-toastify";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import Summary from "./add/summary";

type CreateSecureLinkType = {
    createSecureLink: string
}
type AddNewItemType = {
    addNewItem: boolean
}
type AddNewItemVarType = {
    data: {
        name: string
        description: string
        price_total: number
        price_unit: string
        amount_available: number
        vat: number
        photo_loc: string
        discount: number
        category: string[]
        keyword: string[]
    }
}

const CREATE_SECURE_LINK = gql`
    query CREATE_SECURE_LINK {
        createSecureLink
    }
`
const ADD_NEW_ITEM = gql`
    mutation ADD_NEW_ITEM($data: AddNewItemInput!) {
        addNewItem(data: $data)
    }
`
type Props = {
    modalOpen: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    },
    refetch: any
}

const AddForm: NextPage<Props> = ({modalOpen, refetch}) => {
    const {accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)
    const optionToReTry = useRef<"IMAGE_UPLOAD" | "MODIFY_DETAILS" | null>(null)

    const [invalid, setInvalid] = useState({
        "name": true,
        "description": true,
        "price": true,
        "price_unit": true,
        "discount": true,
        "stock": true
    })
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState<CurrentProduct>({
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

    const photo_loc = useRef<string | null>(null)
    const resolveRef = useRef<((value: unknown) => void) | null>(null)
    const rejectRef = useRef<((value: unknown) => void) | null>(null)


    const priceOriginal = product.price_original
    const vat = product.vat
    const discount = product.discount

    const delay = () => {
        return new Promise((resolve, reject) => {
            resolveRef.current = resolve
            rejectRef.current = reject
        })
    }
    const uploadImage = async (token: string) => {
        const url = API_HOST + "/api/upload/" + token
        const body = new FormData()
        body.append("image", product.image as File)
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

        AddNewItem({
            variables: {
                data: {
                    name: product.name!,
                    description: product.description!,
                    discount: Number(product.discount!),
                    vat: product.vat!,
                    price_total: product.price_total!,
                    price_unit: product.price_unit!,
                    category: product.category!,
                    keyword: product.keyword!,
                    photo_loc: photo_loc.current!,
                    amount_available: product.amount_available!
                }
            }
        })
    }
    const changeInvalidDetails = (id: string, value: boolean) => {
        setInvalid({
            ...invalid,
            [id]: value
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
    const [AddNewItem] = useMutation<AddNewItemType, AddNewItemVarType>(ADD_NEW_ITEM, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: () => {
            toast.success("The Item has been Added")
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
                AddNewItem({
                    variables: {
                        data: {
                            name: product.name!,
                            description: product.description!,
                            discount: Number(product.discount!),
                            vat: product.vat!,
                            price_total: product.price_total!,
                            price_unit: product.price_unit!,
                            category: product.category!,
                            keyword: product.keyword!,
                            photo_loc: photo_loc.current!,
                            amount_available: product.amount_available!
                        }
                    }
                })
            }

            setReTry(false)
        }
    }, [reTry])
    useEffect(() => {
        if(priceOriginal !== null){
            let newPriceTotal = Number(priceOriginal)
            if(vat !== null) newPriceTotal = newPriceTotal * (1 + vat/100)
            if(discount !== null) newPriceTotal = newPriceTotal * (1 - Number(discount)/100)
            setProduct({
                ...product,
                price_total: newPriceTotal
            })
        }
    }, [priceOriginal, vat, discount])

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
                <span className="text-center w-full text-lg">Compile All the Details to Add a Product.</span>
                <div className="flex flex-col gap-6 w-full">
                    <Name
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <Description
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <Price
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <PriceUnit
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <Vat
                        product={{
                            value: product,
                            set: setProduct
                        }}
                    />
                    <Discount
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <ImageUpload
                        product={{
                            value: product,
                            set: setProduct
                        }}
                    />
                    <Stock
                        product={{
                            value: product,
                            set: setProduct
                        }}
                        changeInvalidDetails={changeInvalidDetails}
                    />
                    <Category
                        product={{
                            value: product,
                            set: setProduct
                        }}
                    />
                    <Keyword
                        product={{
                            value: product,
                            set: setProduct
                        }}
                    />
                    <Summary
                        price_original={product.price_original !== null ? Number(product.price_original) : null}
                        vat={product.vat !== null ? product.vat : null}
                        discount={product.discount !== null ? Number(product.discount) : null}
                    />
                    <Buttons
                        type={"ADD"}
                        invalid={(() => {
                            for(const value of Object.values(invalid)){
                                if(value) return true
                            }
                            return false
                        })()}
                        currentProperty={product}
                        setModalOpen={modalOpen.set}
                        loading={loading}
                        handleFormSubmit={handleFormSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AddForm;
