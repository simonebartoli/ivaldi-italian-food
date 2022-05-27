import React, {RefObject, useEffect, useRef, useState} from 'react';
import {FiShoppingCart} from "react-icons/fi";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";
import {useResizer} from "../../contexts/resizer-context";
import {useLayoutContext} from "../../contexts/layout-context";



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
            <span className="font-navbarTitle text-2xl" onClick={closeNav}>
                <span className="text-red-600">Ivaldi</span>
                <span className="text-green"> Italian </span>
                <span className="text-green">Food</span>
            </span>
            <div className="mdx:flex hidden flex-row justify-around items-center text-lg mdx:basis-2/3 xls:basis-1/2 font-navbar">
                <span className="hover:text-green transition cursor-pointer">Shop</span>
                <span className="hover:text-green transition cursor-pointer">Faqs</span>
                <span className="hover:text-green transition cursor-pointer">Contact Us</span>
                <span> | </span>
                <span className="hover:text-green transition cursor-pointer">Log In / Sign Up</span>
                <div className="flex flex-row items-center gap-2">
                    <FiShoppingCart className="text-xl hover:text-green transition cursor-pointer"/>
                    <span className="rounded-full bg-orange-500 text-white px-2 text-sm">10</span>
                </div>
            </div>
            <div className="mdx:hidden flex items-center">
                {!navOpen ?
                    <AiOutlineMenu className="text-2xl hover:text-green transition" onClick={onNavClick}/>
                    :
                    <AiOutlineClose className="text-2xl hover:text-red-600 transition" onClick={onNavClick}/>
                }
                <div ref={mobileNavRef} className="transition-all bg-white flex flex-col items-center gap-4 justify-evenly absolute w-0 overflow-hidden right-0 text-xl font-navbar">
                    <span className="hover:text-green transition cursor-pointer" onClick={onNavClick}>Log In / Sign Up</span>
                    <div className="flex flex-row items-center gap-4">
                        <FiShoppingCart className="text-2xl hover:text-green transition cursor-pointer" onClick={onNavClick}/>
                        <span className="rounded-full bg-orange-500 text-white px-2 text-sm">10</span>
                    </div>
                    <span className="p-[0.5px] bg-neutral-500 w-3/4"/>
                    <span className="hover:text-green transition cursor-pointer" onClick={onNavClick}>Shop</span>
                    <span className="hover:text-green transition cursor-pointer" onClick={onNavClick}>Faqs</span>
                    <span className="hover:text-green transition cursor-pointer" onClick={onNavClick}>Contact Us</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;