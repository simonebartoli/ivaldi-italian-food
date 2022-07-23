import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Counter from "../library/counter";
import {FaRegTrashAlt} from "react-icons/fa";
import {useResizer} from "../../contexts/resizer-context";
import {NextPage} from "next";
import {useCart} from "../../contexts/cart-context";
import {ItemType} from "../../pages/cart";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import {Errors} from "../../enums/errors";

type Props = {
    item: ItemType,
    items: Map<number, ItemType>
    setItems: React.Dispatch<React.SetStateAction<Map<number, ItemType>>>
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
}

enum ACTION_TYPE {
    NO_ACTION,
    EDIT,
    REMOVE
}

const CartArticle: NextPage<Props> = (
    {
        item: {
            item_id,
            name,
            price_unit,
            price_total,
            amount,
            amount_available,
            photo_loc,
            vat,
            discount
        },
        items,
        setItems,
        setRefetch,
        setLoader
    }) => {

    const [amountSelected, setAmountSelected] = useState(amount < amount_available ? amount : amount_available)
    const [render, setRender] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const {item, error, functions: {addToCart, removeFromCart, resetErrorItemStatus}} = useCart()
    const [actionType, setActionType] = useState<ACTION_TYPE>(ACTION_TYPE.NO_ACTION)
    const {widthPage} = useResizer()

    useEffect(() => {
        if(render) {
            setActionType(ACTION_TYPE.EDIT)
            setDisabled(true)
            addToCart(item_id, amountSelected - amount)
        }
        if(!render) setRender(true)

    }, [amountSelected])

    useEffect(() => {
        if(amountSelected > amount_available) setAmountSelected(amount_available) //WHEN OUT OF STOCK | INITIAL STATE DO NOT CHANGE
    }, [amount_available])

    useEffect(() => {
        if(error !== null && item !== null && item.item_id === item_id && actionType !== ACTION_TYPE.NO_ACTION){
            setLoader(false)
            setRefetch(true)
            if(error !== false){
                if(actionType === ACTION_TYPE.EDIT) {
                    setDisabled(false)
                    if(error.graphQLErrors[0] !== undefined && error.graphQLErrors[0].extensions.type === Errors.AMOUNT_NOT_AVAILABLE){
                        setRefetch(true)
                        toast.error("This amount is no more available.")
                    }else{
                        toast.error("There is a problem. Try Again.")
                    }
                }else if(actionType === ACTION_TYPE.REMOVE){
                    if(error.graphQLErrors[0] !== undefined && error.graphQLErrors[0].extensions.type === Errors.ITEM_NOT_EXISTING){
                        setRefetch(true)
                    }else{
                        toast.error("There is a problem. Try Again.")
                    }
                }
                console.log(error.graphQLErrors[0])
            }else{
                if(actionType === ACTION_TYPE.EDIT) {
                    setItems(new Map(items).set(item_id, {...items.get(item_id)!, amount: amountSelected}))
                }
                else if(actionType === ACTION_TYPE.REMOVE) {
                    let item = new Map(items)
                    item.delete(item_id)
                    setItems(item)
                }
            }
            setActionType(ACTION_TYPE.NO_ACTION)
            resetErrorItemStatus()
        }
    }, [error, item, actionType])

    useEffect(() => {
        setDisabled(false)
    }, [items])

    useEffect(() => {
        // console.log(disabled)
    }, [disabled])

    const handleRemoveFromCartClick = () => {
        setActionType(ACTION_TYPE.REMOVE)
        removeFromCart(item_id)
    }

    return (
        <article className="flex smxl:flex-row flex-col gap-4 items-center w-full">
            <div className="shop-list relative smxl:w-1/2 w-full">
                <Image
                    alt="this is a photo" src={"/media/photos/shop/ragu_funghi_300x.webp"} layout={"fill"}
                    className="image"
                />
            </div>
            <div className="flex flex-row gap-8 items-center justify-around smxl:w-1/2 w-full">
                <div className="flex flex-col smxl:gap-10 gap-8 w-full">
                    <span className="text-lg">{name}</span>
                    <div className="flex flex-col gap-2">
                            <span className="text-lg">Price per {price_unit}:
                                <span className="text-2xl font-semibold"> £ {price_total}</span>
                            </span>
                        <span className="text-base"> (included VAT {vat.percentage}%)</span>
                    </div>
                    <div className="flex xlsx:flex-row flex-col smxl:gap-6 gap-10">
                        <div className="smxl:w-fit w-2/3 flex flex-row gap-8 items-center justify-between">
                            <Counter
                                min={1}
                                max={amount_available}
                                itemNumber={amountSelected}
                                setItemNumber={setAmountSelected}
                                options={{fontText: "text-2xl", sizeIcons: "text-2xl"}}
                                disable={disabled}
                            />
                            {
                                render && widthPage < 600 &&
                                <div>
                                    <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                                </div>
                            }
                        </div>
                        <span className="select-none text-2xl text-right smxl:text-left">
                                Total:
                                <span className="text-3xl font-semibold text-green-standard"> £ {(price_total*amountSelected).toFixed(2)}</span>
                            </span>
                    </div>
                </div>
                {
                    render && widthPage >= 600 &&
                        <div onClick={handleRemoveFromCartClick}>
                            <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                        </div>
                }

            </div>
        </article>
    );
};

export default CartArticle;