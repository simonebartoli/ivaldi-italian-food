import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {NextPage} from "next";
import {ApolloError, gql, useLazyQuery, useMutation} from "@apollo/client";
import {Errors} from "../enums/errors";

type ContextType = {
    accessToken: AccessTokenType
    userInfoNav: UserInfoNavType
    loading: boolean
    logged: boolean
    functions: {
        generateAccessToken: () => void
        logout: () => void
        handleAuthErrors: (error: ApolloError) => void
    }
}
type AccessTokenType = {
    token: string | null
    firstRender: boolean
}
type UserInfoNavType = {
    name: string | null
    cart: number | null
}
type CreateAccessTokenType = {
    createAccessTokenStandard: {
        accessToken: string
        publicKey: string
    }
}
type GetUserInfoNavType = {
    getUserInfo: {
        name: string
    }
    getUserCart: [{
        item_id: number
        amount: number
    }]
}


const authContext = createContext<undefined | ContextType>(undefined)

type Props = {
    children: ReactNode
}

const CREATE_ACCESS_TOKEN =gql`
    mutation CREATE_ACCESS_TOKEN {
        createAccessTokenStandard {
            accessToken
            publicKey
        }
    }
`
const GET_USER_INFO_NAV = gql`
    query GET_USER_INFO_NAV {
        getUserInfo {
            name
        }
        getUserCart {
            item_id
            amount
        }
    }
`
const LOGOUT = gql`
    mutation LOGOUT {
        logout
    }
`

const useLoginAuth = (
    accessToken: AccessTokenType,
    generateAccessToken: () => void
) => {

    const [loginStatus, setLoginStatus] = useState({
        loading: true,
        logged: false
    })
    useEffect(() => {
        const checkIfLogged = async () => {
            if (accessToken.token !== null) {
                setLoginStatus({
                    loading: false,
                    logged: true
                })
            } else {
                setLoginStatus({
                    loading: false,
                    logged: false
                })
            }
        }
        if(!accessToken.firstRender) checkIfLogged()
    }, [accessToken])
    return loginStatus
}



export const AuthContext: NextPage<Props> = ({children}) => {
    const [userInfoNav, setUserInfoNav] = useState<UserInfoNavType>({
        name: null,
        cart: null
    })
    const [accessToken, setAccessToken] = useState<AccessTokenType>({
        token: null,
        firstRender: true
    })
    const [publicKey, setPublicKey] = useState<null | string>(null)

    const [generateAccessTokenMutation] = useMutation(CREATE_ACCESS_TOKEN, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            const {accessToken: newAccessToken, publicKey: newPublicKey} = (data as CreateAccessTokenType).createAccessTokenStandard
            setAccessToken({
                token: newAccessToken,
                firstRender: false
            })
            setPublicKey(newPublicKey)
        },
        onError: () => {
            setAccessToken({
                token: null,
                firstRender: false
            })
        }
    })
    const [getUserInfoNavQuery] = useLazyQuery(GET_USER_INFO_NAV, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token,
            }
        },
        fetchPolicy: "network-only",
        onCompleted: (data: GetUserInfoNavType) => {
            let amount = 0
            data.getUserCart.forEach(element => amount += element.amount)

            setUserInfoNav({
                name: data.getUserInfo.name,
                cart: amount
            })
        },
        onError: (error) => {
            console.log(error.message)
        }
    })
    const [logoutMutation] = useMutation(LOGOUT, {
        onCompleted: () => setAccessToken({
            firstRender: false,
            token: null
        }),
        onError: (error) => console.log(error)
    })

    useEffect(() => {
        generateAccessToken()
    }, [])
    useEffect(() => {
        if(accessToken.token !== null && userInfoNav.name === null)
            getUserInfoNavQuery()
        if(accessToken.token === null && userInfoNav.name !== null)
            setUserInfoNav({
                name: null,
                cart: null
            })

    }, [accessToken.token])

    const generateAccessToken = () => {
        generateAccessTokenMutation()
    }
    const logout = async () => {
        logoutMutation()
    }

    const handleAuthErrors = (error: ApolloError) => {
        const graphqlErrorCode = error.graphQLErrors[0].extensions.code
        if(graphqlErrorCode === Errors.AUTH_ERROR){
            generateAccessTokenMutation()
        }
    }

    const {loading, logged} = useLoginAuth(accessToken, generateAccessToken)

    const value = {
        accessToken,
        userInfoNav,
        loading,
        logged,
        functions: {
            generateAccessToken,
            logout,
            handleAuthErrors
        }
    }
    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    );
};


export const useAuth = () => {
    const context = React.useContext(authContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
}
