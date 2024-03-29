import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {IoSearchSharp} from "react-icons/io5";
import {FiShoppingCart} from "react-icons/fi";
import {NextPage} from "next";
import {useCart} from "../../../../contexts/cart-context";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";
import {Bars} from "react-loader-spinner";
import {SERVER_ERRORS_ENUM} from "../../../../enums/SERVER_ERRORS_ENUM";
import {useRouter} from "next/router";
import {API_HOST} from "../../../../settings";

type Item = {
    item_id: number
    name: string
    discount: {
        percentage: number
    } | null
    photo_loc: string
    amount_available: number
    price_total: number
}

const Article: NextPage<{item: Item, hidden?: boolean}> = ({item, hidden= false}) => {
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const componentRef = useRef<boolean>(false)
    const router = useRouter()

    const {item: itemFromContext, error, functions: {addToCart, resetErrorItemStatus}} = useCart()

    useEffect(() => {
        setReady(true)
    }, [])

    useEffect(() => {
        if(error !== null && itemFromContext !== null && itemFromContext.item_id === item.item_id && componentRef.current){
            componentRef.current = false
            if(error === false){
                toast.success("Item Added To Your Cart.")
            }else if(error.graphQLErrors[0] !== undefined && error.graphQLErrors[0].extensions.type === SERVER_ERRORS_ENUM.AMOUNT_NOT_AVAILABLE){
                console.log(error.message)

                toast.error("This Amount Is Not Available.")
                setDisabled(true)
            }else{
                console.log(error.message)

                toast.error("Sorry, there is a problem. Try Again.")
            }
            resetErrorItemStatus()
            setLoading(false)
        }
    }, [error, item])

    const handleAddToCartButtonClick = () => {
        setLoading(true)
        componentRef.current = true
        addToCart(item.item_id, 1)
    }

    return (
        <article className="w-full h-full flex flex-col items-center justify-between gap-6 smxl:p-6 p-0 relative border-b-[1px] border-neutral-400">
            {(item.discount !== null && item.amount_available > 0) &&
                <div className="absolute z-20 text-lg top-0 left-1/2 -translate-x-1/2 w-5/6 p-1 bg-red-600 text-white text-center font-semibold">
                    <span>Save {item.discount.percentage}%</span>
                </div>
            }
            {(item.amount_available === 0) &&
                <div className="absolute z-20 text-lg top-0 left-1/2 -translate-x-1/2 w-5/6 p-1 bg-neutral-400 text-neutral-100 text-center font-semibold">
                    <span>Out of Stock</span>
                </div>
            }
            <div className="flex flex-col items-center justify-center gap-6 w-full">
                <div className="relative h-[192px] w-full flex items-center mt-4">
                    {ready &&
                        <Image  quality={100} src={`${API_HOST}${item.photo_loc}`}
                                      alt={item.name} layout="fill" className={"image"}
                        />
                    }
                </div>
                {(item.discount && item.amount_available > 0) ?
                    <div className="flex flex-row gap-4 items-end">
                        <span className="font-semibold text-2xl">£ {item.price_total}</span>
                        <span className="text-lg italic line-through text-red-600">£ {Number(item.price_total / (1 - item.discount.percentage / 100)).toFixed(2)}</span>
                    </div>
                    :
                    <span className="font-semibold text-2xl">£ {item.price_total}</span>
                }
                <span className="text-lg text-center">{item.name}</span>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <Link href={"/shop/" + item.item_id + (router.query.query !== undefined ? ("?query=" + router.query.query) : "")}>
                    <div className="cursor-pointer w-full p-2 flex flex-row gap-4 items-center justify-center bg-green-standard text-white rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        <a href={"/shop/" + item.item_id + (router.query.query !== undefined ? ("?query=" + router.query.query) : "")}>Check Product</a>
                        <IoSearchSharp/>
                    </div>
                </Link>
                <div className="flex flex-row gap-4">
                    <button onClick={handleAddToCartButtonClick} disabled={item.amount_available === 0 || loading || disabled} className="disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-black basis-3/5 grow w-full p-2 flex flex-row gap-4 items-center justify-center bg-orange-400 text-neutral-100 rounded-lg shadow-md border-neutral-400 border-[1px] text-lg">
                        {
                            loading ? <Bars height={24} color={"white"}/>
                                : <>Add to Cart <FiShoppingCart/></>
                        }
                    </button>
                </div>
            </div>
        </article>
    );
};

export default Article;