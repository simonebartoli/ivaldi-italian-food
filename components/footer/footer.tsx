import React, {useEffect} from 'react';
import Image from "next/image";
import Logo from "../../public/media/photos/logo.png"

import {BsTelephone} from "react-icons/bs";
import {MdOutlineAlternateEmail} from "react-icons/md";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";
import {HOST} from "../../settings";


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
                            <Link href={"/shop"}>
                                <li className="pl-2"><a href={"/shop"} className="pl-2">Shop</a></li>
                            </Link>
                            <Link href={"/"}>
                                <li className="pl-2"><a href={"/"} className="pl-2">Faqs</a></li>
                            </Link>
                            <Link href={"/cart"}>
                                <li className="pl-2"><a href={"/cart"} className="pl-2">Cart</a></li>
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Personal Area</span>
                    <div>
                        <ul className="list-disc list-inside space-y-4">
                            <Link href={"/orders"}>
                                <li className="pl-2"><a href={"/orders"} className="pl-2">My Orders</a></li>
                            </Link>
                            <Link href={"/shipping-address"}>
                                <li className="pl-2"><a href={"/shipping-address"} className="pl-2">My Shipping Address</a></li>
                            </Link>
                            <Link href={"/receipts"}>
                                <li className="pl-2"><a href={"/receipts"} className="pl-2">My Receipts</a></li>
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Contact Us</span>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <BsTelephone className="text-lg"/>
                            <a href="tel:447796513701">+44 77 9651 3701</a>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <MdOutlineAlternateEmail className="text-lg"/>
                            <a href="mailto: info@ivaldi.uk">info@ivaldi.uk</a>
                        </div>
                        <span>
                            Or use our contact form <Link href={"/contact"}>
                            <a href={"/contact"}>HERE</a></Link>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-semibold text-2xl">Conditions</span>
                    <div>
                        <ul className="list-disc list-inside space-y-4">
                            <li className="pl-2"><a href={`${HOST}/terms`} target={"_blank"} rel={"noreferrer"} className="pl-2">Terms & Conditions</a></li>
                            <li className="pl-2"><a href={`${HOST}/terms`} target={"_blank"} rel={"noreferrer"} className="pl-2">Privacy Policy</a></li>
                            <li className="pl-2"><a href={`${HOST}/terms`} target={"_blank"} rel={"noreferrer"} className="pl-2">Payment System</a></li>
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