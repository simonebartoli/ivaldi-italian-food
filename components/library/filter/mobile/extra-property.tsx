import React, {ChangeEvent} from 'react';
import {NextPage} from "next";

type Props = {
    outOfStock: boolean
    discountOnly: boolean
    handleDiscountOnlyOptionClick: (e: ChangeEvent<HTMLInputElement>) => void
    handleOutOfStockOptionClick: (e: ChangeEvent<HTMLInputElement>) => void
}

const ExtraProperty: NextPage<Props> = ({outOfStock, discountOnly, handleOutOfStockOptionClick, handleDiscountOnlyOptionClick}) => {
    return (
        <div className="border-b-[1px] border-neutral-300 flex smx:text-xl text-lg w-full flex-col justify-center items-center">
            <div className="p-6 flex flex-row items-center justify-start w-full gap-6">
                <input checked={discountOnly} onChange={(e) => handleDiscountOnlyOptionClick(e)} type="checkbox" className="scale-125"/>
                <span>Discount Only</span>
            </div>
            <div className="p-6 flex flex-row items-center justify-start w-full gap-6">
                <input checked={outOfStock} onChange={(e) => handleOutOfStockOptionClick(e)} type="checkbox" className="scale-125"/>
                <span>Show Out of Stock</span>
            </div>
        </div>
    );
};

export default ExtraProperty;