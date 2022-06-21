import React, {useEffect} from 'react';
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import {BsGeoAltFill} from "react-icons/bs";
import {IoHome, IoNewspaper, IoPersonCircleSharp} from "react-icons/io5";
import {FaFileSignature} from "react-icons/fa";
import Link from "next/link";

const NavbarAccount = () => {
    const {heightPage, widthPage} = useResizer()
    const {navHeight, accountNavbarRef, setAccountNavbarWidth} = useLayoutContext()

    useEffect(() => {
        if(navHeight !== undefined && heightPage !== undefined && accountNavbarRef.current !== null){
            accountNavbarRef.current.style.minHeight = `${heightPage - navHeight}px`
            accountNavbarRef.current.style.top = `${navHeight}px`
            setAccountNavbarWidth(accountNavbarRef.current.clientWidth)
        }
    }, [heightPage, navHeight, widthPage])
    return (
        <nav ref={accountNavbarRef} className="hidden border-r-2 border-black sticky w-1/3 lg:w-[22.5%] sm:flex flex-col justify-evenly gap-16 p-8 lg:text-xl text-lg bg-slate-900">
            <Link href="/account">
                <div className="flex flex-row gap-6 items-center cursor-pointer">
                    <IoPersonCircleSharp className="mt-1 lg:text-4xl text-3xl text-green-standard"/>
                    <a href={"/account"} className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Account</a>
                </div>
            </Link>
            <Link href="/orders">
                <div className="flex flex-row gap-6 items-center cursor-pointer">
                    <IoNewspaper className="mt-1 lg:text-4xl text-3xl text-green-standard"/>
                    <a href={"/orders"} className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Orders</a>
                </div>
            </Link>
            <Link href="/receipts">
                <div className="flex flex-row gap-6 items-center cursor-pointer">
                    <FaFileSignature className="mt-1 lg:text-4xl text-3xl text-green-standard"/>
                    <a href={"/receipts"} className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Receipts</a>
                </div>
            </Link>
            <Link href="/shipping-addresses">
                <div className="flex flex-row gap-6 items-center cursor-pointer">
                    <IoHome className="mt-1 lg:text-4xl text-3xl text-green-standard"/>
                    <a href={"/shipping-addresses"} className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Shipping Addresses</a>
                </div>
            </Link>
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <BsGeoAltFill className="mt-1 lg:text-4xl text-3xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Billing Addresses</span>
            </div>
        </nav>
    );
};

export default NavbarAccount;