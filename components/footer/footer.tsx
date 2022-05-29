import React, {useEffect} from 'react';
import Image from "next/image";
import Logo from "../../public/media/photos/test.png"

import {BsTelephone} from "react-icons/bs";
import {MdOutlineAlternateEmail} from "react-icons/md";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";


const Footer = () => {
    const {heightPage, widthPage} = useResizer()
    const {setFooterHeight, footerRef} = useLayoutContext()

    useEffect(() => {
        if(footerRef.current !== null)
            setFooterHeight(footerRef.current.clientHeight)
    }, [heightPage, widthPage])

    return (
        <footer ref={footerRef} className="border-t-8 border-green-standard flex flex-row w-full smx:px-16 px-8 py-8 bg-neutral-200 mdx:justify-between justify-center items-center bg-white flex-wrap sm:gap-8 gap-12">
            <div className="grid sm:grid-cols-2 sm:grid-rows-2 grid-cols-1 grid-rows-4 grid-flow-col gap-8 items-center mdx:basis-2/4 grow sm:basis-full basis-1/2">
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Web Pages</span>
                    <div>
                        <ul className="list-disc list-inside space-y-4">
                            <li className="pl-2"><span className="pl-2">Shop</span></li>
                            <li className="pl-2"><span className="pl-2">Faqs</span></li>
                            <li className="pl-2"><span className="pl-2">Cart</span></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Personal Area</span>
                    <div>
                        <ul className="list-disc list-inside space-y-4">
                            <li className="pl-2"><span className="pl-2">My Orders</span></li>
                            <li className="pl-2"><span className="pl-2">My Shipping Address</span></li>
                            <li className="pl-2"><span className="pl-2">My Payment Method</span></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Contact Us</span>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <BsTelephone className="text-lg"/>
                            <a href="tel:155152">07723093701</a>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <MdOutlineAlternateEmail className="text-lg"/>
                            <a href="mailto: domain@gmail.com">domain@gmail.com</a>
                        </div>
                        <span>Or use our contact form HERE</span>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Conditions</span>
                    <div>
                        <ul className="list-disc list-inside space-y-4">
                            <li className="pl-2"><span className="pl-2">Terms & Conditions</span></li>
                            <li className="pl-2"><span className="pl-2">Privacy Policy</span></li>
                            <li className="pl-2"><span className="pl-2">Payment System</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mdx:basis-1/4 mdx:grow grow-0 sm:basis-1/2 basis-3/4">
                <Image src={Logo} alt="This is the Ivaldi Italian Food Logo"/>
            </div>
        </footer>
    );
};

export default Footer;