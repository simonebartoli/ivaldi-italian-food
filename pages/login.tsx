import React, {useEffect, useRef} from 'react';
import LoginSection from "../components/login/loginSection";
import SignupSection from "../components/login/signupSection";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import {useAuth, useLoginAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";

const Login = () => {
    const router = useRouter()
    const {accessToken} = useAuth()
    const {loading, logged} = useLoginAuth(accessToken)

    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight!}px`
        }
    })

    if(loading) return <PageLoader display/>
    if(logged) {
        router.push("/account")
        return <PageLoader display/>
    }


    return (
        <main ref={fullPageRef} className="flex md:flex-row flex-col items-center justify-center w-full h-full">
            <LoginSection/>
            <SignupSection/>
        </main>
    );
};

export default Login;