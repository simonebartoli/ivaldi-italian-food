import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {NextPage} from "next";
import {useAuth} from "./auth-context";
import {ApolloError, gql, useLazyQuery, useMutation} from "@apollo/client";

export type ItemCartType = {
    item_id: number
    amount: number
}
type RemoveItemCartType = {
    item_id: number
}
type ContextType = {
    cart: Map<number, number>
    cartReady: boolean
    error: ApolloError | null | false
    item: ItemCartType | null
    functions: {
        updateCart: () => void
        addToCart: (item_id: number, amount: number) => void
        removeFromCart: (item_id: number) => void
        resetErrorItemStatus: () => void
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
const REMOVE_RECORD = gql`
    mutation REMOVE_RECORD($data: RemoveEntryFromCartInput!) {
        removeRecord(data: $data)
    }
`
const SYNC_CARTS = gql`
    mutation SYNC_CARTS($data: [AddEntryToCartInput!]!) {
        syncCarts(data: $data)
    }
`
const GET_USER_CART = gql`
    query GET_USER_CART {
        getUserCart {
            item_id
            amount
        }
    }
`

let reTryOperation = false // IN CASE OF TOKEN EXPIRED
let actionType: string | null = null // DECIDE WHICH QUERY/MUTATION EXECUTE
let firstRender: boolean = true

export const CartContext: NextPage<Props> = ({children}) => {
    const {logged, loading, accessToken, functions: {handleAuthErrors}} = useAuth()
    const [cart, setCart] = useState<Map<number, number>>(new Map())
    const [cartReady, setCartReady] = useState(false)

    const [item, setItem] = useState<ItemCartType | null>(null)
    const [localItems, setLocalItems] = useState<ItemCartType[] | null>(null)

    const [error, setError] = useState<ApolloError | null | false>(null)

    const [addNewRecord] = useMutation<boolean, { data: ItemCartType }>(ADD_NEW_RECORD, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token
            }
        },
        onCompleted: () => {
            setError(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType = "addNewRecord"
                reTryOperation = true
                return
            }
            setError(error)
            console.log(error.message)
        }
    })
    const [removeRecord] = useMutation<boolean, {data: RemoveItemCartType}>(REMOVE_RECORD, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token
            }
        },
        onCompleted: () => {
            setError(false)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType = "removeRecord"
                reTryOperation = true
                return
            }
            setError(error)
            console.log(error.message)
        }
    })

    const [syncCarts] = useMutation<boolean, { data: ItemCartType[] }>(SYNC_CARTS, {
        context: {
            headers: {
                authorization: "Bearer " + accessToken.token
            }
        },
        onCompleted: () => {
            getUserCart({
                context: {
                    headers: {
                        authorization: "Bearer " + accessToken.token
                    }
                }
            })
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType = "syncCarts"
                reTryOperation = true
                return
            }
            console.log(error.message)
        }
    })
    const [getUserCart] = useLazyQuery<{getUserCart: ItemCartType[]}>(GET_USER_CART, {
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const items = new Map<number, number>()
            for(const element of data.getUserCart){
                items.set(element.item_id, element.amount)
            }
            localStorage.removeItem("cart")
            setCart(items)
        },
        onError: async (error) => {
            const result = await handleAuthErrors(error)
            if(result){
                actionType = "getUserCart"
                reTryOperation = true
                return
            }
            console.log(error.message)
        }
    })

    useEffect(() => {
        if(accessToken.token !== null && reTryOperation) {
            if(actionType === "addNewRecord" && item !== null){
                addNewRecord({
                    variables: {
                        data: {
                            item_id: item.item_id,
                            amount: item.amount
                        }
                    }
                })
            }else if (actionType === "getUserCart"){
                getUserCart({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token
                        }
                    }
                })
            }else if (actionType === "syncCarts" && localItems !== null){
                syncCarts({
                    variables: {
                        data: localItems
                    }
                })
            }else if (actionType === "removeRecord" && item !== null){
                removeRecord({
                    variables: {
                        data: {
                            item_id: item.item_id
                        }
                    }
                })
            }

            actionType = null
            reTryOperation = false
        }
    }, [accessToken, item, localItems])

    useEffect(() => {
        if(!loading) {
            updateCart()
        }
    }, [loading, logged])

    useEffect(() => {
        if(firstRender) firstRender = false
        else {
            if(!cartReady) setCartReady(true)
        }

        if(cart.size > 0) {
            if(!logged){
                const appStorage: ItemCartType[] = []
                for(const [key, value] of cart.entries()) appStorage.push({item_id: key, amount: value})
                localStorage.setItem("cart", JSON.stringify(appStorage))
            }
        }
        else localStorage.removeItem("cart")

    }, [cart])


    useEffect(() => {
        if(error === false && item !== null){
            let newStorage = new Map<number, number>(cart)
            if(item.amount === 0){
                newStorage.delete(item.item_id)
            }else{
                newStorage = cart.has(item.item_id) ?
                    newStorage.set(item.item_id, cart.get(item.item_id)! + item.amount) :
                    newStorage.set(item.item_id, item.amount)
            }
            setCart(newStorage)
        }
    }, [error, item])

    const parseLocalStorageCart = (data: string): Map<number, number> | false => {
        try {
            const dataJSON = JSON.parse(data) as ItemCartType[]
            const items = new Map<number, number>()
            for(const element of dataJSON){
                if(element.item_id === undefined || element.amount === undefined) throw new Error()
                if(isNaN(Number(element.item_id)) || isNaN(Number(element.amount))) throw new Error()

                items.set(element.item_id, element.amount)
            }
            return items
        }catch (e) {
            localStorage.removeItem("cart")
            return false
        }
    }

    const addToCart = async (item_id: number, amount: number) => {
        setItem(null)
        setItem({item_id: item_id, amount: amount})

        if(logged){
            addNewRecord({
                variables: {
                    data: {
                        item_id: item_id,
                        amount: amount
                    }
                }
            })
        }else{
            setError(false)
        }
    }

    const removeFromCart = async (item_id: number) => {
        setItem(null)
        setItem({item_id: item_id, amount: 0})

        if(logged){
            removeRecord({
                variables: {
                    data: {
                        item_id: item_id
                    }
                }
            })
        }else{
            setError(false)
        }
    }

    const updateCart = () => {
        const data = localStorage.getItem("cart")

        if(!logged){
            if(data !== null){
                const result = parseLocalStorageCart(data)
                if(result !== false) setCart(result)
            }else{
                setCart(new Map())
            }
        }else{
            if(data !== null){
                const result = parseLocalStorageCart(data)
                if(result !== false) {
                    const mutationData: ItemCartType[] = []
                    for(const [key, amount] of Array.from(result.entries())){
                        mutationData.push({
                            item_id: key,
                            amount: amount
                        })
                    }
                    console.log(mutationData)
                    setLocalItems(mutationData)
                    syncCarts({
                        variables: {
                            data: mutationData
                        }
                    })
                }
            }else{
                getUserCart({
                    context: {
                        headers: {
                            authorization: "Bearer " + accessToken.token
                        }
                    }
                })
            }
        }
    }

    const resetErrorItemStatus = () => {
        setItem(null)
        setError(null)
    }

    const value: ContextType = {
        cart: cart,
        cartReady: cartReady,
        error: error,
        item: item,
        functions: {
            updateCart,
            addToCart,
            removeFromCart,
            resetErrorItemStatus
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
