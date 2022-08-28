import React, {ChangeEvent, useEffect, useRef} from 'react';
import {AiOutlineMenu} from "react-icons/ai";
import {useResizer} from "../../../../contexts/resizer-context";
import {useLayoutContext} from "../../../../contexts/layout-context";
import OrderBy from "./order-by";
import SelectCategory from "./select-category";
import PriceRange from "./price-range";
import {NextPage} from "next";
import ExtraProperty from "./extra-property";

type Props = {
    priceRange?: {
        priceMin: {
            value: number
            set: React.Dispatch<React.SetStateAction<number>>
        }
        priceMax: {
            value: number
            set: React.Dispatch<React.SetStateAction<number>>
        }
        setFetchPriceRange: React.Dispatch<React.SetStateAction<boolean>>
        setMinTypedByUser: React.Dispatch<React.SetStateAction<boolean>>
        setMaxTypedByUser: React.Dispatch<React.SetStateAction<boolean>>
    }
    extraProperty?: {
        outOfStock: boolean
        discountOnly: boolean
        handleDiscountOnlyOptionClick: (e: ChangeEvent<HTMLInputElement>) => void
        handleOutOfStockOptionClick: (e: ChangeEvent<HTMLInputElement>) => void
    }
}

const FilterMobile: NextPage<Props> = ({
                                           priceRange,
                                           extraProperty
                                       }) => {

    const {heightPage} = useResizer()
    const {navHeight, searchBarHeight} = useLayoutContext()
    const filtersRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (navHeight !== undefined && searchBarHeight !== undefined && filtersRef.current !== null) {
            filtersRef.current.style.maxHeight = `${heightPage - searchBarHeight}px`
            filtersRef.current.style.top = `${searchBarHeight}px`
        }
    }, [navHeight, searchBarHeight])

    const handleContextMenuClick = () => {
        if (filtersRef.current !== null) {
            filtersRef.current.classList.toggle("hidden")
        }
    }

    return (
        <div className="w-1/3 self-stretch cursor-pointer xls:hidden">
            <div onClick={handleContextMenuClick}
                 className="flex flex-row smx:gap-4 gap-2 items-center justify-center text-xl text-base p-3 xls:justify-end bg-white rounded-lg border-[1px] border-neutral-400">
                <span className="smxl:text-xl text-lg">Filter <span
                    className="smx:inline-block hidden">By</span> </span>
                <AiOutlineMenu className="smxl:text-xl text-lg"/>
            </div>
            <div ref={filtersRef}
                 className="hidden overflow-y-scroll absolute shadow-lg bg-white z-20 left-0 w-full flex flex-col">
                <OrderBy/>
                <SelectCategory/>
                {
                    priceRange &&
                    <PriceRange
                        priceMin={priceRange.priceMin}
                        priceMax={priceRange.priceMax}
                        setFetchPriceRange={priceRange.setFetchPriceRange}
                        setMinTypedByUser={priceRange.setMinTypedByUser}
                        setMaxTypedByUser={priceRange.setMaxTypedByUser}
                    />
                }
                {
                    extraProperty &&
                    <ExtraProperty
                        discountOnly={extraProperty.discountOnly}
                        outOfStock={extraProperty.outOfStock}
                        handleOutOfStockOptionClick={extraProperty.handleOutOfStockOptionClick}
                        handleDiscountOnlyOptionClick={extraProperty.handleDiscountOnlyOptionClick}
                    />
                }
            </div>
        </div>
    );
};

export default FilterMobile;