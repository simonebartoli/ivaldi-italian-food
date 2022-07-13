import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {NextPage} from "next";
import {useAuth} from "./auth-context";
import {ApolloError, gql} from "@apollo/client";
import {apolloClient} from "../pages/_app";

export type ItemCartType = {
    item_id: number
    amount: number
}
type ContextType = {
    cart: Map<number, number>
    functions: {
        addToCart: (item_id: number, amount: number) => Promise<boolean | ApolloError>
    }
}

const cartContext = createContext<undefined | ContextType>(undefined)

type Props = {
    children: ReactNode
}

const ADD_NEW_RECORD = gql`
    mutation ADD_NEW_RECORD($data: AddEntryToCartInput!) {
        addNewRecord(data: $data)
    }
`

export const CartContext: NextPage<Props> = ({children}) => {
    const {loading, logged, accessToken, functions: {handleAuthErrors}} = useAuth()

    const [storage, setStorage] = useState<Map<number, number>>(new Map()) // DO IT WITH MAPS
    const [firstRender, setFirstRender] = useState(true)

    useEffect(() => {
        // MANAGE LOGIN
        const data = localStorage.getItem("cart")
        if(data !== null){
            try {
                const dataJSON = JSON.parse(data) as ItemCartType[]
                const items = new Map<number, number>()
                for(const element of dataJSON){
                    if(element.item_id === undefined || element.amount === undefined) throw new Error()
                    if(isNaN(Number(element.item_id)) || isNaN(Number(element.amount))) throw new Error()

                    items.set(element.item_id, element.amount)
                }
                setStorage(items)
            }catch (e) {
                localStorage.removeItem("cart")
            }
        }
        setFirstRender(false)
    }, [])

    useEffect(() => {
        if(!firstRender){
            if(storage.size > 0) {
                const appStorage: ItemCartType[] = []
                for(const [key, value] of storage.entries()) appStorage.push({item_id: key, amount: value})
                localStorage.setItem("cart", JSON.stringify(appStorage))
            }
            else localStorage.removeItem("cart")
        }
    }, [storage, firstRender])

    const addToCart = async (item_id: number, amount: number): Promise<true | ApolloError> => {
        try{
            if(!loading && logged){
                await apolloClient.mutate<boolean, {data: ItemCartType }>({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token
                        }
                    },
                    mutation: ADD_NEW_RECORD,
                    variables: {
                        data: {
                            item_id: item_id,
                            amount: amount
                        }
                    }
                })
            }
            const newStorage = storage.has(item_id) ?
                new Map(storage).set(item_id, storage.get(item_id)! + amount) :
                new Map(storage).set(item_id, amount)

            setStorage(newStorage)
            return true
        }catch (e) {
            return e as ApolloError
        }
    }

    const value: ContextType = {
        cart: storage,
        functions: {
            addToCart
        }
    }
    return (
        <cartContext.Provider value={value}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    const context = React.useContext(cartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
