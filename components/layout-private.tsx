import React, {useEffect, useRef} from 'react';
import NavbarAccount from "./navbar/navbar-account";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import {NextPage} from "next";

type Props = {
    children: React.ReactNode
    className?: string
}

const LayoutPrivate: NextPage<Props> = ({children, className}) => {
    const {accountNavbarWidth} = useLayoutContext()
    const {widthPage} = useResizer()
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(mainRef.current !== null && accountNavbarWidth !== undefined){
            console.log(accountNavbarWidth)
            mainRef.current.style.width = `${widthPage - accountNavbarWidth}px`
        }
    }, [accountNavbarWidth, widthPage])

    return (
        <main className="w-full flex flex-row items-start justify-between">
            <NavbarAccount/>
            <div ref={mainRef} className={className === undefined ? "" : className}>
                {children}
            </div>
        </main>
    );
};

export default LayoutPrivate;