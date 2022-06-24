import React from 'react';
import LayoutPrivate from "../components/layout-private";
import AddAddress from "../components/addresses/add-address";
import ExistingAddress from "../components/addresses/existing-address";

const ShippingAddresses = () => {
    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-16 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="p-4 text-3xl">My Shipping Addresses</h1>
            <AddAddress/>
            {
                new Array(3).fill([]).map((_, index) =>
                    <ExistingAddress key={index}/>
                )
            }
        </LayoutPrivate>
    );
};


export default ShippingAddresses;