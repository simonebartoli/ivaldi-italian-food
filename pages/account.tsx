import React, {useEffect, useRef} from 'react';
import NavbarAccount from "../components/navbar/navbar-account";
import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";
import NameDob from "../components/account/name-dob";
import Email from "../components/account/email";
import Password from "../components/account/password";
import 'react-slidedown/lib/slidedown.css'

const Account = () => {
    const {accountNavbarWidth} = useLayoutContext()
    const {widthPage} = useResizer()
    const mainRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(mainRef.current !== null && accountNavbarWidth !== undefined){
            console.log(accountNavbarWidth)
            mainRef.current.style.width = `${widthPage - accountNavbarWidth}px`
        }
    }, [accountNavbarWidth])

    return (
        <main className="flex flex-row items-start justify-between w-full">
            <NavbarAccount/>
            <div ref={mainRef} className="self-stretch flex h-full flex-col gap-8 items-center justify-start p-8">
                <h1 className="text-3xl">My Account</h1>
                <NameDob/>
                <Email/>
                <Password/>
            </div>
        </main>
    );
};

export default Account;