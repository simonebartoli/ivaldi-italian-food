import React, {RefObject, useEffect, useRef, useState} from 'react';
import {FiShoppingCart} from "react-icons/fi";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";
import Link from "next/link";



const Navbar = () => {
    const {heightPage, widthPage} = useResizer()
    const {navHeight, setNavHeight, navbarRef} = useLayoutContext()

    const mobileNavRef : RefObject<HTMLDivElement> = useRef(null)
    const [navOpen, setNavOpen] = useState(false)

    useEffect(() => {
        setNavHeight(navbarRef.current?.clientHeight)
    }, [heightPage, widthPage])
    useEffect(() => {
        if(mobileNavRef.current !== null && navHeight !== undefined) {
            mobileNavRef.current.style.top = `${navHeight}px`
            mobileNavRef.current.style.height = `${heightPage - navHeight}px`
        }
    }, [navHeight, heightPage])

    const onNavClick = () => {
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
                <Link href="/login">
                    <a className="hover:text-green-standard transition cursor-pointer">Log In / Sign Up</a>
                </Link>
                <Link href="/cart">
                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                        <FiShoppingCart className="text-xl hover:text-green-standard transition"/>
                        <span className="rounded-full bg-orange-500 text-white px-2 text-sm">10</span>
                    </div>
                </Link>
            </div>
            <div className="mdx:hidden flex items-center">
                {!navOpen ?
                    <AiOutlineMenu className="text-2xl hover:text-green-standard transition" onClick={onNavClick}/>
                    :
                    <AiOutlineClose className="text-2xl hover:text-red-600 transition" onClick={onNavClick}/>
                }
                <div ref={mobileNavRef} className="transition-all bg-white flex flex-col items-center gap-4 justify-evenly absolute w-0 overflow-hidden right-0 text-xl font-navbar">
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