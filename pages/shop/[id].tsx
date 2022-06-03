import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {MdArrowForwardIos} from "react-icons/md";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Counter from "../../components/library/counter";
import useBlurData from "use-next-blurhash";

const Product = () => {
    const [ready, setReady] = useState(false)
    const [blurDataUrl] = useBlurData("L%Nc$qbb_4V@NHaeoKf+xvj[WAWU")

    const mainRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()
    const [itemNumber, setItemNumber] = useState(1)

    useEffect(() => setReady(true), [])

    useEffect(() => {
        if(mainRef.current !== null && navHeight !== undefined){
            mainRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])


    return (
        <main ref={mainRef} className="flex flex-col gap-8 p-8 transition-all">
            <div className="flex flex-row flex-wrap text-lg items-center gap-4 text-gray-500">
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span className="cursor-pointer hover:text-black transition hover:underline underline-offset-8">Shop</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span className="cursor-pointer hover:text-black transition hover:underline underline-offset-8">Discounts</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <MdArrowForwardIos/>
                    <span className="shrink cursor-pointer hover:text-black transition hover:underline underline-offset-8">Grand Ragu&apos; Star Meat and Mushrooms Sauce (2x180g)</span>
                </div>
            </div>
            <article className="flex mdx:flex-row flex-col justify-evenly items-center p-2 gap-8 my-4">
                <div className="shop-list mdx:basis-2/5 md:w-1/2 sm:w-3/4 w-full grow mdx:sticky top-[20%] lg:!static">
                    {ready &&
                        <Image quality={100} src={"/media/photos/shop/ragu_funghi_300x.webp"}
                               alt="photo" layout="fill" className="image"
                               placeholder={"blur"} blurDataURL={blurDataUrl}
                        />
                    }
                </div>
                <div className="flex flex-col justify-center gap-16 basis-3/5 p-2 relative">
                    <div className="lg:space-y-6 space-y-10">
                        <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 items-center w-full">
                            <div className="flex flex-row gap-4 items-center p-4 bg-neutral-100 border-[1px] lg:w-fit w-full justify-center">
                                <span className="font-sans text-xl font-bold">DISCOUNT</span>
                                <span className={"font-sans text-4xl text-red-600 font-bold"}>-50%</span>
                            </div>
                            <div>
                                <span className="text-left text-green-standard underline underline-offset-8 text-lg">Already 3 Items in the Cart</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold">Grand Ragu&apos; Star Meat and Mushrooms Sauce (2x180g)</h1>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley.
                        </p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-row gap-4 items-center">
                            <span className="rounded-full bg-green-standard w-[15px] h-[15px]"/>
                            <span>Available in Stock</span>
                        </div>
                        <div className={"flex smxl:flex-row flex-col gap-8 smxl:items-end smxl:justify-start justify-end"}>
                            <div className="flex flex-row gap-8 items-end">
                                <div>
                                    <span className="text-3xl font-semibold">£ 2.75</span>
                                    <span> / </span>
                                    <span>KG</span>
                                </div>
                                <span className="text-xl italic line-through text-red-600">£ 5.50</span>
                            </div>
                            <span className="text-lg">£ 2.75 x {itemNumber} = <span className="text-green-standard">£ 13.75</span></span>
                        </div>
                    </div>
                    <div className="flex smx:flex-row flex-col gap-6 lg:w-3/5 w-full justify-between">
                        <div className="smx:basis-1/5 basis-1/2 smx:grow grow-0 shrink">
                            <Counter min={1} max={9} itemNumber={itemNumber} setItemNumber={setItemNumber}/>
                        </div>
                        <div className="h-fit before:bg-orange-600 z-0 hover:before:w-full text-xl bg-orange-500 text-center text-white border-2 border-black rounded-lg button-animated basis-4/5">
                            <span className="block relative z-10 cursor-pointer p-4">Add to Cart</span>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    );
};

export default Product;