import React, {ChangeEvent, useEffect, useMemo} from 'react';
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";

type Props = {
    item: {
        price_total: number
        price_unit: string
        discount: number
        vat: number
    },
    currentProperty: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    },
    invalid: {
        value: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
}

const Price: NextPage<Props> = ({item, currentProperty, invalid}) => {
    const priceNoAddition = useMemo(() => {
        return (
            item.price_total / ((1 + item.vat/100) * (1 - (item.discount !== null ? item.discount : 0)/100))
        )
    }, [])

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        const pattern = /^\d*(\.\d{0,2})?$/gm
        const OK = pattern.test(newValue)
        if (OK) {
            if(Number(newValue) === priceNoAddition)
                currentProperty.set({...currentProperty.value, price_original: null})
            else
                currentProperty.set({
                    ...currentProperty.value,
                    price_original: newValue
                })
        }
    }
    const handlePriceUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if(currentProperty.value["price_unit"] === item.price_unit)
            currentProperty.set({...currentProperty.value, price_unit: null})
        else
            currentProperty.set({...currentProperty.value, price_unit: newValue})
    }
    const handleVatChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        if(currentProperty.value["vat"] === item.vat)
            currentProperty.set({...currentProperty.value, vat: null})
        else
            currentProperty.set({...currentProperty.value, vat: Number(newValue)})
    }

    const handleBlurPriceDecimals = () => {
        if(currentProperty.value["price_original"] !== null) {
            currentProperty.set({
                ...currentProperty.value,
                price_original: Number(currentProperty.value["price_original"]).toFixed(2)
            })
        }
    }

    useEffect(() => {
        const price_original = Number(currentProperty.value["price_original"] )
        const price_unit = currentProperty.value["price_unit"] as string
        const vat = currentProperty.value["vat"] as number


        if(price_original !== null || price_unit !== null || vat !== null){
            if(price_original !== null){
                if(Number(price_original) > 500 || Number(price_original) === 0) {
                    invalid.set(true)
                    return
                }else {
                    invalid.set(false)
                }
            }
            if(price_unit !== null){
                if(price_unit.length === 0 || price_unit.length > 5) {
                    invalid.set(true)
                    return
                }else {
                    invalid.set(false)
                }
            }
        }else{
            invalid.set(false)
        }
    }, [currentProperty.value])


    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <span>Price (No Discounts - No VAT):</span>
                <input
                    onChange={(e) => handlePriceChange(e)}
                    onBlur={handleBlurPriceDecimals}
                    value={currentProperty.value["price_original"] !== null ? currentProperty.value["price_original"] : priceNoAddition.toFixed(2)}
                    placeholder={"Insert the price of the product here..."}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
            <div className="flex flex-col gap-3">
                <span>Price Unit:</span>
                <input
                    value={currentProperty.value["price_unit"] !== null ? currentProperty.value["price_unit"] : item.price_unit}
                    onChange={(e) => handlePriceUnitChange(e)}
                    placeholder={"Insert the price unit of the product here..."}
                    type="text"
                    className="p-3 w-full border-[1px] rounded-lg shadow-md"/>
            </div>
            <div className="flex flex-col gap-3">
                <span>VAT:</span>
                <select onChange={(e) => handleVatChange(e)} value={currentProperty.value["vat"] !== null ? currentProperty.value["vat"] : item.vat} className="w-full text-xl p-3 rounded-lg">
                    <option value={20}>20%</option>
                    <option value={5}>5%</option>
                    <option value={0}>0%</option>
                </select>
            </div>
            <div className="my-6 flex flex-col gap-3 text-xl">
                <span>Price With VAT (No Discounts):</span>
                <span className="font-semibold">
                    {`£ ${currentProperty.value["price_original"] !== null ?
                        (Number(currentProperty.value["price_original"]) * (1 + (currentProperty.value["vat"] !== null ? Number(currentProperty.value["vat"]) : item.vat)/100)).toFixed(2) : 
                        (priceNoAddition * (1 + (currentProperty.value["vat"] !== null ? Number(currentProperty.value["vat"]) : item.vat)/100)).toFixed(2)}`}
                </span>
            </div>
        </div>
    );
};

export default Price;