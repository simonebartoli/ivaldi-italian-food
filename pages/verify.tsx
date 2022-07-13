import React, {useEffect, useRef, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import PageLoader from "../components/page-loader";
import {GetServerSideProps, NextPage} from "next";
import Image from "next/image";
import ConfirmImage from "../public/media/photos/checkout/confirm.svg";
import ForbiddenImage from "../public/media/photos/login/forbidden.svg";

import {useLayoutContext} from "../contexts/layout-context";
import {useResizer} from "../contexts/resizer-context";

type Props = {
    secret: string
}

const CHANGE_STATUS_RECOVER_TOKEN = gql`
    mutation CHANGE_STATUS_RECOVER_TOKEN($data: ChangeRecoverTokenStatusInputs!) {
        changeStatusRecoverToken(data: $data)
    }
`

const Verify: NextPage<Props> = ({secret}) => {
    const [verified, setVerified] = useState(false)
    const fullPageRef = useRef<HTMLDivElement>(null)
    const {navHeight} = useLayoutContext()
    const {heightPage} = useResizer()

    const [changeStatusRecoverToken, {loading}] = useMutation(CHANGE_STATUS_RECOVER_TOKEN,
        {
            variables: {
                data: {
                    secret: secret !== undefined ? secret : ""
                }
            },
            onError: (error) => setVerified(false),
            onCompleted: () => setVerified(true)
        })

    useEffect(() => {
        changeStatusRecoverToken()
    }, [])

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [loading, navHeight, heightPage])

    if(loading) return <PageLoader display/>


    return (
        <main ref={fullPageRef} className="p-8 w-full flex flex-col items-center justify-center">
            {
                verified ?
                    <>
                        <div className="mb-12 h-[150px] relative w-full">
                            <Image alt="Confirmation Icon" src={ConfirmImage} layout={"fill"} objectFit={"contain"}/>
                        </div>
                        <h1 className="smxl:text-4xl sm:text-5xl text-3xl text-center leading-10 text-green-standard font-semibold mb-16">Your Access Has Been Verified</h1>
                        <span className="smxl:text-2xl text-lg mb-12 text-center">You can close this tab now and go back to your session 🎉</span>
                    </>

                :
                    <>
                        <div className="mb-12 h-[150px] relative w-full">
                            <Image alt="Forbidden Icon" src={ForbiddenImage} layout={"fill"} objectFit={"contain"}/>
                        </div>
                        <h1 className="smxl:text-4xl sm:text-5xl text-3xl text-center leading-10 text-red-600 font-semibold mb-16">The Session Cannot Be Authorised</h1>
                        <div className="p-8 bg-neutral-100 rounded-lg">
                            <span className="text-center smxl:text-xl leading-8">
                                If you have clicked on the link after 1 hour of the arrival of the email, you need to log in again.
                                This link is expired.
                            </span>
                        </div>
                    </>
            }
        </main>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {secret} = context.query
    return {
        props: {
            secret: secret === undefined ? "" : secret
        }
    }
}

export default Verify;