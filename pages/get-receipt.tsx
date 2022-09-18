import React, {useEffect, useRef} from 'react';
import {GetServerSideProps} from "next";
import {gql} from "@apollo/client";
import {apolloClient} from "./_app";
import {useResizer} from "../contexts/resizer-context";
import {useLayoutContext} from "../contexts/layout-context";
import {API_HOST} from "../settings";

const GET_OR_CREATE_RECEIPT_PDF = gql`
    mutation GET_OR_CREATE_RECEIPT_PDF ($data: CreateRetrievePdfInput!) {
        getOrCreateReceiptPDF(data: $data)
    }
`
type GetOrCreateReceiptPDFType = {
    getOrCreateReceiptPDF: string
}
type GetOrCreateReceiptPDFVarType = {
    data: {
        order_ref: string
    }
}

const GetReceipt = () => {
    const {heightPage} = useResizer()
    const {navHeight} = useLayoutContext()
    const fullPageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(fullPageRef.current !== null && navHeight !== undefined){
            fullPageRef.current.style.minHeight = `${heightPage - navHeight}px`
        }
    }, [heightPage, navHeight])

    return (
        <div ref={fullPageRef} className="w-full flex flex-col justify-center items-center">
            <div className="p-24 bg-neutral-50">
                <span className="text-5xl text-neutral-500">Sorry, Your Receipt Has Not Been Found</span>
            </div>
        </div>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    let ORDER_FOUND = false
    let RECEIPT_LINK = ""

    const {order_ref} = context.query
    if(order_ref !== undefined && !Array.isArray(order_ref)){
        const {data} = await apolloClient.mutate<GetOrCreateReceiptPDFType, GetOrCreateReceiptPDFVarType>({
            mutation: GET_OR_CREATE_RECEIPT_PDF,
            variables: {
                data: {
                    order_ref: order_ref
                }
            },
            errorPolicy: "all"
        })
        if(data){
            ORDER_FOUND = true
            RECEIPT_LINK = data.getOrCreateReceiptPDF
        }
    }

    if(ORDER_FOUND){
        return {
            redirect: {
                destination: `${API_HOST}/${RECEIPT_LINK}/invoice.pdf`,
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default GetReceipt;