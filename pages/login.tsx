import React, {useEffect, useRef} from 'react';
import LoginSection from "../components/login/loginSection";
import SignupSection from "../components/login/signupSection";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";

const Login = () => {
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])

    return (
        //smxl:p-8 p-4 py-16
        <main ref={fullPageRef} className="flex md:flex-row flex-col items-center justify-center w-full h-full">
                <LoginSection/>
                <SignupSection/>
        </main>
    );
};

export default Login;