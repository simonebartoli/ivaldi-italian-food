import React, {useEffect, useRef, useState} from 'react';
import LoginSection from "../components/login/loginSection";
import SignupSection from "../components/login/signupSection";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import {useAuth} from "../contexts/auth-context";
import PageLoader from "../components/page-loader";
import {useRouter} from "next/router";
import {HOST, TWITTER_USERNAME} from "../settings";
import Head from "next/head";

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
        const {cart, orders, receipts} = router.query
        if(cart !== undefined) setRedirectTo("cart")
        else if(orders !== undefined) setRedirectTo(`orders${orders === "" ? "" : ("?order_ref=" + orders)}`)
        else if(receipts !== undefined) setRedirectTo(`receipts${receipts === "" ? "" : ("?order_ref=" + receipts)}`)

    }, [router])

    if(loading) return <PageLoader display/>
    if(logged) {
        router.push( redirectTo !== null ? `/${redirectTo}` : "/account")
        return <PageLoader display/>
    }


    return (
        <main ref={fullPageRef} className="flex md:flex-row flex-col items-center justify-center w-full h-full">
            <Head>
                <title>{`Login - Ivaldi Italian Food`}</title>
                <meta name="description" content={"Login here to access your orders information and to proceed to the checkout."}/>
                <meta name="keywords" content={"login,private,dashboard,orders,receipts,email,password,security"}/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>

                <meta property="og:title" content={`Login - Ivaldi Italian Food`}/>
                <meta property="og:site_name" content={HOST}/>
                <meta property="og:url" content={`${HOST}/login`}/>
                <meta property="og:description" content={"Login here to access your orders information and to proceed to the checkout."}/>
                <meta property="og:type" content="product"/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={TWITTER_USERNAME}/>
                <meta name="twitter:title" content={`${HOST}/login`}/>
                <meta name="twitter:description" content={"Login here to access your orders information and to proceed to the checkout."}/>
            </Head>
            <LoginSection/>
            <SignupSection redirectTo={redirectTo}/>
        </main>
    );
};

export default Login;