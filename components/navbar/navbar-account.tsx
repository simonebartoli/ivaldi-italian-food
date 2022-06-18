import React, {useEffect} from 'react';
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import {BsGeoAltFill} from "react-icons/bs";
import {IoHome, IoNewspaper, IoPersonCircleSharp} from "react-icons/io5";
import {FaFileSignature} from "react-icons/fa";

const NavbarAccount = () => {
    const {heightPage} = useResizer()
    const {navHeight, accountNavbarRef, setAccountNavbarWidth} = useLayoutContext()

    useEffect(() => {
        if(navHeight !== undefined && heightPage !== undefined && accountNavbarRef.current !== null){
            accountNavbarRef.current.style.minHeight = `${heightPage - navHeight}px`
            accountNavbarRef.current.style.top = `${navHeight}px`
            setAccountNavbarWidth(accountNavbarRef.current.clientWidth)
        }
    }, [heightPage, navHeight])
    return (
        <nav ref={accountNavbarRef} className="border-r-2 border-black sticky w-[22.5%] flex flex-col justify-evenly gap-16 p-8 text-xl bg-slate-900">
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <IoPersonCircleSharp className="mt-1 text-4xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Account</span>
            </div>
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <IoNewspaper className="mt-1 text-4xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Orders</span>
            </div>
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <FaFileSignature className="mt-1 text-4xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Receipts</span>
            </div>
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <IoHome className="mt-1 text-4xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Shipping Addresses</span>
            </div>
            <div className="flex flex-row gap-6 items-center cursor-pointer">
                <BsGeoAltFill className="mt-1 text-4xl text-green-standard"/>
                <span className="!text-white after:!bg-white hover-underline-animation transition hover:text-green-standard">My Billing Addresses</span>
            </div>
        </nav>
    );
};

export default NavbarAccount;