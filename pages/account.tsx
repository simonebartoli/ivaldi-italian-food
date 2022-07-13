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

const Account = () => {
    const [fullName, setFullName] = useState<string | null>(null)
    const [dob, setDob] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()

    const [getUserInfo] = useLazyQuery(GET_USER_INFO, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        onCompleted: (data: GetUserInfoType) => {
            setFullName(`${data.getUserInfo.name} ${data.getUserInfo.surname}`)
            setDob(DateTime.fromISO(data.getUserInfo.dob).toFormat("d LLL yyyy"))
            setEmail(data.getUserInfo.email)
        },
        onError: (error) => {
            handleAuthErrors(error)
            console.log(error.message)
        }
    })
    const router = useRouter()

    useEffect(() => {
        if(accessToken.token !== null) getUserInfo()
    }, [accessToken])

    if(loading) {
        return <PageLoader display={true}/>
    }
    if(!logged) {
        router.push("/login")
        return <PageLoader display/>
    }


    return (
        <LayoutPrivate className="self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4">
            <h1 className="text-3xl">My Account</h1>
            <NameDob fullName={fullName} dob={dob}/>
            <Email email={email}/>
            <Password/>
        </LayoutPrivate>
    );
};

export default Account;