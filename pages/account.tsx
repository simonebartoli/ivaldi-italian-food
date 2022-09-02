import React, {useEffect, useState} from 'react';
import NameDob from "../components/account/name-dob";
import Email from "../components/account/email";
import Password from "../components/account/password";
import 'react-slidedown/lib/slidedown.css'
import LayoutPrivate from "../components/layout-private";
import {useAuth} from "../contexts/auth-context";
import {useRouter} from "next/router";
import PageLoader from "../components/page-loader";
import {gql, useLazyQuery} from "@apollo/client";
import {DateTime} from "luxon";
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";

type GetUserInfoType = {
    getUserInfo: {
        name: string
        surname: string
        dob: string
        email: string
    }
}

const GET_USER_INFO = gql`
    query GET_USER_INFO {
        getUserInfo {
            name
            surname
            dob
            email
        }
    }
`

const MetaAccount = () => {
    return (
        <Head>
            <title>{`Dashboard - Ivaldi Italian Food`}</title>
            <meta name="description" content={"Change your password and email in this page."}/>
            <meta name="keywords" content={"email,lost,password,reset,info,account,name,surname"}/>
            <meta name="robots" content="index, follow"/>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="language" content="English"/>
            <meta name="revisit-after" content="5 days"/>
            <meta name="author" content="Ivaldi Italian Food"/>

            <meta property="og:title" content={`Dashboard - Ivaldi Italian Food`}/>
            <meta property="og:site_name" content={HOST}/>
            <meta property="og:url" content={`${HOST}/account`}/>
            <meta property="og:description" content={"Change your password and email in this page."}/>
            <meta property="og:type" content="product"/>

            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content={TWITTER_USERNAME}/>
            <meta name="twitter:title" content={`${HOST}/account`}/>
            <meta name="twitter:description" content={"Change your password and email in this page."}/>
        </Head>
    )
}

const Account = () => {
    const [fullName, setFullName] = useState<string | null>(null)
    const [dob, setDob] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [reTry, setReTry] = useState(false)


    const [getUserInfo] = useLazyQuery(GET_USER_INFO, {
        onCompleted: (data: GetUserInfoType) => {
            setFullName(`${data.getUserInfo.name} ${data.getUserInfo.surname}`)
            setDob(DateTime.fromISO(data.getUserInfo.dob).toFormat("d LLL yyyy"))
            setEmail(data.getUserInfo.email)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result) {
                setReTry(true)
                return
            }
            console.log(error.message)
        }
    })
    const router = useRouter()

    useEffect(() => {
        if(!loading && logged) {
            getUserInfo({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [loading, logged])

    useEffect(() => {
        if(accessToken !== null && reTry){
            getUserInfo({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
    }, [accessToken, reTry])

    if(loading) {
        return (
            <>
                <MetaAccount/>
                <PageLoader display={true}/>
            </>
        )
    }
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }


    return (
        <LayoutPrivate className="self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4">
            <MetaAccount/>
            <h1 className="text-3xl">My Account</h1>
            <NameDob fullName={fullName} dob={dob}/>
            <Email email={email} setEmail={setEmail}/>
            <Password/>
        </LayoutPrivate>
    );
};

export default Account;