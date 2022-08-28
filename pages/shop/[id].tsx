import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {MdArrowForwardIos} from "react-icons/md";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Counter from "../../components/library/counter";
import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {gql} from "@apollo/client";
import {apolloClient} from "../_app";
import PageLoader from "../../components/page-loader";
import {useCart} from "../../contexts/cart-context";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {SERVER_ERRORS_ENUM} from "../../enums/SERVER_ERRORS_ENUM";

type ItemType = {
    item_id: number
    name: string
    description: string
    amount_available: number
    category: string[]
    photo_loc: string
    price_total: number
    price_unit: string
    vat: {
        percentage: number
    }
    discount: {
        percentage: number
        notes: string
    } | null
}

type GetItemType = {
    getItem: ItemType
}

const GET_ITEM = gql`
    query GET_ITEM($id: Int!) {
        getItem(id: $id){
            item_id
            name
            description
            amount_available
            category
            photo_loc
            price_total
            price_unit
            vat {
                 percentage
            }
            discount {
                percentage
                notes
            }
        }
    }
`

const Product: NextPage<ItemType> = ({
    item_id,
    name,
    description,
    amount_available,
    category,
    photo_loc,
    price_total,
    price_unit,
    vat,
    discount
                                     }) => {

    const mainRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()
    const {cart, error, functions: {addToCart, resetErrorItemStatus}} = useCart()

    const [ready, setReady] = useState(false)
    const [availableThisSession, setAvailableThisSession] = useState(0)
    const [itemNumber, setItemNumber] = useState(1)


    useEffect(() => {
        if(item_id !== undefined) {
            const itemCart = cart.get(item_id)

            setAvailableThisSession(amount_available - (itemCart === undefined ? 0 : itemCart))
            if(amount_available === 0) setItemNumber(0)
            setReady(true)
        }
    }, [item_id])

    useEffect(() => {
        if(mainRef.current !== null && navHeight !== undefined){
            mainRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])

    useEffect(() => {
        if(error !== null){
            if(error === false){
                toast.success(`${itemNumber} ${name} Have Been Added to the Cart`)
                setAvailableThisSession(availableThisSession - itemNumber)
            }else{
                const errorType = error.graphQLErrors[0].extensions
                if(errorType.type === SERVER_ERRORS_ENUM.AMOUNT_NOT_AVAILABLE){
                    toast.error("This quantity is not available")
                }
                else if(errorType.code === SERVER_ERRORS_ENUM.AUTH_ERROR){
                    toast.error("Your session has expired. Please Login Again")
                }else{
                    toast.error("There is an Error. Please Try Again.")
                }
            }
            resetErrorItemStatus()
        }
    }, [error])

    const handleAddToCartButton = async () => {
        await addToCart(item_id, itemNumber)
    }

    useEffect(() => {
        setItemNumber(availableThisSession > 0 ? 1 : 0)
    }, [availableThisSession])

    return (
        <main ref={mainRef} className="flex flex-col gap-8 p-8 transition-all">
            {ready ? <>
            <div className="flex flex-row flex-wrap text-lg items-center gap-4 text-gray-500">
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span
                        className="cursor-pointer hover:text-black transition hover:underline underline-offset-8">Shop</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span
                        className="cursor-pointer hover:text-black transition hover:underline underline-offset-8">Discounts</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span
                        className="shrink cursor-pointer hover:text-black transition hover:underline underline-offset-8">{name}</span>
                </div>
            </div>
            <article className="flex mdx:flex-row flex-col justify-evenly items-center p-2 gap-8 my-4">
                <div className="shop-list mdx:basis-2/5 md:w-1/2 sm:w-3/4 w-full grow mdx:sticky top-[20%] lg:!static">
                    {ready &&
                        <Image quality={100} src={"/media/photos/shop/ragu_funghi_300x.webp"}
                               alt="photo" layout="fill" className="image"
                        />
                    }
                </div>
                <div className="flex flex-col justify-center gap-16 basis-3/5 p-2 relative">
                    <div className="lg:space-y-6 space-y-10">
                        <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 items-center w-full">
                            {
                                discount !== null &&
                                <div
                                    className="flex flex-row gap-4 items-center p-4 bg-neutral-100 border-[1px] lg:w-fit w-full justify-center">
                                    <span className="font-sans text-xl font-bold">DISCOUNT</span>
                                    <span
                                        className={"font-sans text-4xl text-red-600 font-bold"}>-{discount?.percentage}%</span>
                                </div>
                            }
                            <div>
                                {cart.has(item_id) &&
                                    <span className="text-left text-green-standard underline underline-offset-8 text-lg">
                                        Already {cart.get(item_id)} Item{cart.get(item_id)! > 1 && "s"} in the Cart
                                    </span>
                                }
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold">{name}</h1>
                        <p>{description}</p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-row gap-4 items-center">
                            <span
                                className={`rounded-full ${amount_available > 0 ? "bg-green-standard" : "bg-red-600"} w-[15px] h-[15px]`}/>
                            <span>{amount_available === 0 && "Not"} Available in Stock</span>
                        </div>
                        <div
                            className={"flex smxl:flex-row flex-col gap-8 smxl:items-end smxl:justify-start justify-end"}>
                            <div className="flex flex-row gap-8 items-end">
                                <div>
                                    <span className="text-3xl font-semibold">£ {price_total}</span>
                                    <span> / </span>
                                    <span>{price_unit}</span>
                                </div>
                                {
                                    discount !== null &&
                                    <span className="text-xl italic line-through text-red-600">£ {(price_total * (discount.percentage/100 + 1)).toFixed(2)}</span>
                                }
                            </div>
                            <span className="text-lg">{price_total} x {itemNumber} = <span className="text-green-standard">£ {(price_total * itemNumber).toFixed(2)}</span></span>
                        </div>
                    </div>
                    <div className="flex smx:flex-row flex-col gap-6 lg:w-3/5 w-full justify-between">
                        <div className="smx:basis-1/5 basis-1/2 smx:grow grow-0 shrink">
                            <Counter
                                min={availableThisSession > 0 ? 1 : 0}
                                max={availableThisSession > 9 ? 9 : availableThisSession}
                                itemNumber={itemNumber}
                                setItemNumber={setItemNumber}/>
                        </div>
                        <button
                            onClick={handleAddToCartButton}
                            disabled={availableThisSession === 0}
                            className="disabled:cursor-not-allowed shadow-lg disabled:bg-neutral-300 disabled:text-black hover:bg-orange-400 transition cursor-pointer p-4 bg-orange-500 h-fit w-full text-xl text-center text-white rounded-lg basis-4/5">Add to Cart</button>
                    </div>
                </div>
            </article>
            </> : <PageLoader display/>}
        </main>

    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = Number(context.params?.id)
    if(isNaN(Number(id))){
        return {
            redirect: {
              destination: "/shop",
                permanent: false
            },
            props: {}
        }
    }
    let result

    try{
        result = await apolloClient.query<GetItemType>({
            query: GET_ITEM,
            variables: {
                id: id
            }
        })
    }catch (e) {
        return {
            redirect: {
                destination: "/shop",
                permanent: false
            },
            props: {}
        }
    }
    const {data: {getItem}} = result

    return {
        props: {
            item_id: Number(getItem.item_id),
            name: getItem.name,
            description: getItem.description,
            amount_available: getItem.amount_available,
            category: getItem.category,
            photo_loc: getItem.photo_loc,
            price_total: getItem.price_total,
            price_unit: getItem.price_unit,
            vat: {
                percentage: getItem.vat.percentage
            },
            discount: getItem.discount === null ? null : {
                percentage: getItem.discount.percentage,
                notes: getItem.discount.notes
            }
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
      paths: [
          {
              params: {id: "1"}
          }
      ],
      fallback: true
  }
}


export default Product;