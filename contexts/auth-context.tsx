import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {NextPage} from "next";
import {ApolloError, gql, useLazyQuery, useMutation} from "@apollo/client";
import {SERVER_ERRORS_ENUM} from "../enums/SERVER_ERRORS_ENUM";
import {apolloClient} from "../pages/_app";

type ContextType = {
    accessToken: AccessTokenType
    userInfoNav: UserInfoNavType
    loading: boolean
    logged: boolean
    functions: {
        generateAccessToken: () => void
        logout: () => void
        handleAuthErrors: (error: ApolloError) => Promise<boolean>
    }
}
type AccessTokenType = {
    token: string | null
    firstRender: boolean
}
type UserInfoNavType = {
    name: string | null
}
type CreateAccessTokenType = {
    createAccessTokenStandard: {
        accessToken: string
        publicKey: string
    }
}
type GetUserInfoType = {
    getUserInfo: {
        name: string
    }
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
const GET_USER_INFO = gql`
    query GET_USER_INFO {
        getUserInfo {
            name
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
    })
    const [accessToken, setAccessToken] = useState<AccessTokenType>({
        token: null,
        firstRender: true
    })
    const [getUserInfoNavQuery] = useLazyQuery(GET_USER_INFO, {
        fetchPolicy: "network-only",
        onCompleted: (data: GetUserInfoType) => {
            setUserInfoNav({
                name: data.getUserInfo.name,
            })
        },
        onError: (error) => {
            console.log(error.graphQLErrors)
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
        if(accessToken.token !== null && userInfoNav.name === null) {
            getUserInfoNavQuery({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token,
                    }
                }
            })
        }
        if(accessToken.token === null && userInfoNav.name !== null)
            setUserInfoNav({
                name: null,
            })

    }, [accessToken])

    const generateAccessToken = async () => {
        try{
            const result = await apolloClient.mutate<CreateAccessTokenType>({
                mutation: CREATE_ACCESS_TOKEN,
                fetchPolicy: "network-only",
            })
            setAccessToken({
                token: result.data!.createAccessTokenStandard.accessToken,
                firstRender: false
            })
            return true
        }catch (e){
            setAccessToken({
                token: null,
                firstRender: false
            })
            return false
        }
    }
    const logout = async () => {
        logoutMutation()
    }

    const handleAuthErrors = async (error: ApolloError): Promise<boolean> => {
        const graphqlErrorCode = error.graphQLErrors[0].extensions.code
        if(graphqlErrorCode === SERVER_ERRORS_ENUM.AUTH_ERROR){
            return await generateAccessToken()
        }
        return false
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
