import React, {ReactNode, useEffect, useRef, useState} from 'react';
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";
import {useResizer} from "../contexts/resizer-context";
import {NextPage} from "next";
import Loader from "./loader";
import {useLayoutContext} from "../contexts/layout-context";

type Props = {
    children: ReactNode
}

const Layout: NextPage<Props> = ({children}) => {
    const {heightPage} = useResizer()
    const {navHeight, footerHeight} = useLayoutContext()

    const [displayLoader, setDisplayLoader] = useState(true)
    const mainSectionRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if(mainSectionRef.current !== null && navHeight !== undefined && footerHeight !== undefined){
            mainSectionRef.current.style.minHeight = `${heightPage - navHeight - footerHeight}px`
            setDisplayLoader(false)
        }
    }, [navHeight, footerHeight, heightPage])

    return (
        <>
            <Loader display={displayLoader}/>
            <Navbar/>
                <div ref={mainSectionRef} className="transition-all">
                    {children}
                </div>
            <Footer/>
        </>
    );
};

export default Layout;