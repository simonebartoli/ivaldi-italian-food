import React, {useState} from 'react';
import LayoutPrivate from "../components/layout-private";
import AddAddress from "../components/addresses/add-address";
import ExistingAddress from "../components/addresses/existing-address";

const ShippingAddresses = () => {
    const [addresses, setAddresses] = useState([])

    return (
        <LayoutPrivate className={"self-stretch flex h-full flex-col gap-16 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4"}>
            <h1 className="p-4 text-3xl">My Shipping Addresses</h1>
            <AddAddress/>
            {
                addresses.length === 0 ?
                    <div className="w-full flex items-center p-14 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>
                    :
                    addresses.map((_, index) =>
                        <ExistingAddress key={index}/>
                    )
            }
        </LayoutPrivate>
    );
};


export default ShippingAddresses;