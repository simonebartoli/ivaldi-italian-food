import React from 'react';
import Product from "./product";
import Total from "./total";
import {ItemType} from "../../pages/orders";
import {NextPage} from "next";
import {AddressReactType} from "../../pages/checkout";

type Props = {
    items: ItemType[]
    summary: {
        reference: string
        shipping_address: AddressReactType
        price_total: number
        vat_total: number
    }
}

const ProductsList: NextPage<Props> = ({items, summary}) => {
    return (
        <div className="p-8 w-full flex flex-col gap-8 items-center justify-center">
            <span className="w-full pt-2 text-center text-sm border-t-[1px] border-neutral-500 border-dashed">Order Details</span>
            {
                items.map((item, _) =>
                    <Product item={item} key={_}/>
                )
            }
            <span className="border-t-[1px] border-dashed border-neutral-500 w-full"/>
            <Total summary={summary}/>
        </div>
    );
};

export default ProductsList;