import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Counter from "../library/counter";
import {FaRegTrashAlt} from "react-icons/fa";
import {useResizer} from "../../contexts/resizer-context";

const CartArticle = () => {
    const [number, setNumber] = useState(5)
    const [ready, setReady] = useState(false)

    useEffect(() => {setReady(true)}, [])
    const {widthPage} = useResizer()

    return (
        <article className="flex smxl:flex-row flex-col gap-4 items-center w-full">
            <div className="shop-list relative">
                <Image
                    alt="this is a photo" src={"/media/photos/shop/ragu_funghi_300x.webp"} layout={"fill"}
                    className="image"
                />
            </div>
            <div className="flex flex-row gap-8 items-center">
                <div className="flex flex-col smxl:gap-10 gap-8">
                    <span className="text-lg">Grand Ragu&apos; Star Meat and Mushrooms Sauce (2x180g)</span>
                    <div className="flex flex-col gap-2">
                            <span className="text-lg">Price per Unit:
                                <span className="text-2xl font-semibold"> £ 2.70</span>
                            </span>
                        <span className="text-base"> (included VAT 12.5%)</span>
                    </div>
                    <div className="flex xlsx:flex-row flex-col smxl:gap-6 gap-10">
                        <div className="smxl:w-fit w-2/3 flex flex-row gap-8 items-center justify-between">
                            <Counter min={1} max={10} itemNumber={number} setItemNumber={setNumber}
                                     options={{fontText: "text-2xl", sizeIcons: "text-2xl"}}/>
                            {
                                ready && widthPage < 600 &&
                                <div>
                                    <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                                </div>
                            }
                        </div>
                        <span className="select-none text-2xl text-right smxl:text-left">
                                Total:
                                <span className="text-3xl font-semibold text-green-standard"> £ 15.70</span>
                            </span>
                    </div>
                </div>
                {
                    ready && widthPage >= 600 &&
                        <div>
                            <FaRegTrashAlt className="text-3xl text-neutral-500 cursor-pointer hover:text-red-600 transition"/>
                        </div>
                }

            </div>
        </article>
    );
};

export default CartArticle;