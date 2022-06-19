import React from 'react';
import Product from "./product";
import Total from "./total";

const ProductsList = () => {
    return (
        <div className="w-full flex flex-col pt-8 gap-8 items-center justify-center">
            <span className="w-full pt-2 text-center text-sm border-t-[1px] border-neutral-500 border-dashed">Order Details</span>
            {
                new Array(10).fill([]).map((_, index) =>
                    <Product key={index}/>
                )
            }
            <span className="border-t-[1px] border-dashed border-neutral-500 w-full"/>
            <Total/>
        </div>
    );
};

export default ProductsList;