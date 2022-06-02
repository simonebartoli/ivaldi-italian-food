import React, {useEffect, useState} from 'react';
import CartArticle from "../components/cart/cartArticle";
import CartSummary from "../components/cart/cartSummary";
import {useResizer} from "../contexts/resizer-context";

const Cart = () => {
    const {widthPage} = useResizer()
    const [ready, setReady] = useState(false)

    useEffect(() => {setReady(true)}, [])
    return (
        <main className="flex flex-col justify-center w-full items-center p-8">
            <article className="w-full flex lg:flex-row flex-col justify-between items-start xlsx:gap-40 smxl:gap-24 gap-16 h-full">
                {ready && widthPage < 1024 ?
                    <>
                        <CartSummary/>
                        <span className="pt-[1px] bg-neutral-500 w-full"/>
                    </> :
                    ""
                }
                <section className="flex flex-col gap-20 items-start justify-start basis-2/3 w-full">
                    {new Array(5).fill([]).map((_, index) =>
                        <CartArticle key={index}/>
                    )}
                </section>
                {ready && widthPage < 1024 ?
                    <span className="pt-[1px] bg-neutral-500 w-full"/> :
                    ""
                }
                <CartSummary/>
            </article>
        </main>
    );
};

export default Cart;