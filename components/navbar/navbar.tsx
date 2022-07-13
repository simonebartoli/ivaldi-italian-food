import React, {RefObject, useEffect, useRef, useState} from 'react';
import {FiLogOut, FiShoppingCart} from "react-icons/fi";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";
import {IoMdArrowDropdown} from "react-icons/io";
import {useAuth} from "../../contexts/auth-context";
import {useCart} from "../../contexts/cart-context";


const Navbar = () => {
    const {userInfoNav, functions: {logout}} = useAuth()
    const {cart} = useCart()
    const {heightPage, widthPage} = useResizer()
    const {navHeight, setNavHeight, navbarRef} = useLayoutContext()

    const mobileNavRef : RefObject<HTMLDivElement> = useRef(null)
    const [navOpen, setNavOpen] = useState(false)
    const [accountNavOpen, setAccountNavOpen] = useState(false)

    const [cartNumber, setCartNumber] = useState(0)

    useEffect(() => {
        setNavHeight(navbarRef.current?.clientHeight)
    }, [heightPage, widthPage])
    useEffect(() => {
        if(mobileNavRef.current !== null && navHeight !== undefined) {
            mobileNavRef.current.style.top = `${navHeight}px`
            mobileNavRef.current.style.height = `${heightPage - navHeight}px`
        }
    }, [navHeight, heightPage])

    useEffect(() =>{
        let total = 0
        for(const value of cart.values()) total += value
        setCartNumber(total)
    }, [cart])

    const onNavClick = () => {
        if(navbarRef.current !== null){
            navbarRef.current.classList.toggle("z-40")
            navbarRef.current.classList.toggle("z-50")
        }
        setNavOpen(!navOpen)
        if(mobileNavRef.current !== null) {
            mobileNavRef.current.classList.toggle("w-0")
            mobileNavRef.current.classList.toggle("w-full")
        }
    }

    const closeNav = () => {
        setNavOpen(false)
        if(mobileNavRef.current !== null) {
            mobileNavRef.current.classList.add("w-0")
            mobileNavRef.current.classList.remove("w-full")
        }
    }

    const handlePrivateAccountNavClick = () => {
        setAccountNavOpen(!accountNavOpen)
    }
    const handleLogoutClick = () => {
        logout()
    }

    return (
        <nav ref={navbarRef} className="sticky top-0 z-40 flex flex-row justify-between shadow-lg p-6 bg-white">
            <Link href="/">
                <a className="font-navbarTitle text-2xl" onClick={closeNav}>
                    <span className="text-red-600">Ivaldi</span>
                    <span className="text-green-standard"> Italian </span>
                    <span className="text-green-standard">Food</span>
                </a>
            </Link>
            <div className="mdx:flex hidden flex-row justify-around items-center text-lg mdx:basis-2/3 xls:basis-1/2 font-navbar">
                <Link href={"/shop"}>
                    <a className="hover:text-green-standard transition cursor-pointer">Shop</a>
                </Link>
                <span className="hover:text-green-standard transition cursor-pointer">Faqs</span>
                <Link href="/contact">
                    <a className="hover:text-green-standard transition cursor-pointer">Contact Us</a>
                </Link>
                <span> | </span>
                {
                    userInfoNav.name === null ?
                        <Link href="/login">
                            <a className="hover:text-green-standard transition cursor-pointer">Log In / Sign Up</a>
                        </Link>
                        :
                        <Link href="/account">
                            <a className="hover:text-green-standard transition cursor-pointer">Hi {userInfoNav.name}</a>
                        </Link>
                }
                <Link href="/cart">
                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                        <FiShoppingCart className="text-xl hover:text-green-standard transition"/>
                        <span className="rounded-full bg-orange-500 text-white px-2 text-sm">
                            {cartNumber}
                        </span>
                    </div>
                </Link>
                {
                    userInfoNav.name !== null &&
                    <div onClick={handleLogoutClick} className="flex flex-row items-center gap-2 cursor-pointer">
                        <FiLogOut className="text-xl hover:text-red-600 transition"/>
                    </div>
                }
            </div>
            <div className="mdx:hidden flex items-center overflow-y-scroll">
                {!navOpen ?
                    <AiOutlineMenu className="text-2xl hover:text-green-standard transition" onClick={onNavClick}/>
                    :
                    <AiOutlineClose className="text-2xl hover:text-red-600 transition" onClick={onNavClick}/>
                }
                {/*REPLACE GAP AND JUSTIFY BETWEEN WITH JUSTIFY START ONLY WHEN LOGGED*/}
                <div ref={mobileNavRef} className="py-8 overflow-y-scroll transition-all bg-white flex flex-col items-center gap-20 justify-start absolute w-0 overflow-hidden right-0 text-xl font-navbar">
                    <div className="flex flex-col gap-6 items-center justify-center w-full">
                        <div onClick={handlePrivateAccountNavClick} className="flex flex-row gap-4 justify-center items-center hover:text-green-standard transition cursor-pointer">
                            <span>Your Private Area</span>
                            <IoMdArrowDropdown/>
                        </div>
                        {
                            accountNavOpen ?
                                <div className="p-8 flex flex-col gap-10 items-center justify-center bg-neutral-100 w-5/6">
                                    <Link href="/account">
                                        <a onClick={onNavClick} href={"/account"} className="text-center hover:text-green-standard transition cursor-pointer">Your Account</a>
                                    </Link>
                                    <Link href="/orders">
                                        <a href={"/orders"} onClick={onNavClick} className="text-center hover:text-green-standard transition cursor-pointer">Your Orders</a>
                                    </Link>
                                    <Link href="/receipts">
                                        <a href={"/receipts"} className="text-center hover:text-green-standard transition cursor-pointer">Your Receipts</a>
                                    </Link>
                                    <Link href="/shipping-addresses">
                                        <a href={"/shipping-addresses"} className="text-center hover:text-green-standard transition cursor-pointer">Your Shipping Addresses</a>
                                    </Link>
                                    <Link href="/billing-addresses">
                                        <a href={"/billing-addresses"} className="text-center hover:text-green-standard transition cursor-pointer">Your Delivery Addresses</a>
                                    </Link>
                                </div>
                                : null
                        }
                    </div>
                    <Link href="/login">
                        <a className="hover:text-green-standard transition cursor-pointer" onClick={onNavClick}>Log In / Sign Up</a>
                    </Link>
                    <Link href="/cart">
                        <div className="flex flex-row items-center gap-4 cursor-pointer" onClick={onNavClick}>
                            <FiShoppingCart className="text-2xl hover:text-green-standard transition"/>
                            <span className="rounded-full bg-orange-500 text-white px-2 text-sm">10</span>
                        </div>
                    </Link>
                    <span className="p-[0.5px] bg-neutral-500 w-3/4"/>
                    <Link href={"/shop"}>
                        <span className="hover:text-green-standard transition cursor-pointer" onClick={onNavClick}>Shop</span>
                    </Link>
                    <span className="hover:text-green-standard transition cursor-pointer" onClick={onNavClick}>Faqs</span>
                    <Link href="/contact">
                        <a className="hover:text-green-standard transition cursor-pointer" onClick={onNavClick}>Contact Us</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;