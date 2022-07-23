import React, {useEffect, useRef, useState} from 'react';
import LoginSection from "../components/login/loginSection";
import SignupSection from "../components/login/signupSection";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";

const Login = () => {
    const router = useRouter()
    const {loading, logged} = useAuth()

    const fullPageRef = useRef<HTMLDivElement>(null)
    const [redirectTo, setRedirectTo] = useState<string | null>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight!}px`
        }
    }, [loading, heightPage, navHeight])

    useEffect(() => {
        const {cart, orders} = router.query
        if(cart !== undefined) setRedirectTo("cart")
        else if(orders !== undefined) setRedirectTo("orders")
    }, [router])

    if(loading) return <PageLoader display/>
    if(logged) {
        router.push( redirectTo !== null ? `/${redirectTo}` : "/account")
        return <PageLoader display/>
    }


    return (
        <main ref={fullPageRef} className="flex md:flex-row flex-col items-center justify-center w-full h-full">
            <LoginSection/>
            <SignupSection redirectTo={redirectTo}/>
        </main>
    );
};

export default Login;