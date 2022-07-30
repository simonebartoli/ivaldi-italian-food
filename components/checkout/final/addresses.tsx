import React from 'react';
import {AddressReactType} from "../../../pages/checkout";
import {NextPage} from "next";

type Props = {
    shippingAddress: AddressReactType
    billingAddress: AddressReactType
}

const Addresses: NextPage<Props> = ({shippingAddress, billingAddress}) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full p-4 bg-neutral-100 rounded-lg flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <p>
                    {shippingAddress.first_address},&nbsp;
                    {shippingAddress.second_address && shippingAddress.second_address + ", "}
                    {shippingAddress.postcode},&nbsp;
                    {shippingAddress.city}
                </p>
            </div>
            <div className="w-full p-4 bg-neutral-100 rounded-lg flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Billing Address</h3>
                <p>
                    {billingAddress.first_address},&nbsp;
                    {billingAddress.second_address && billingAddress.second_address + ", "}
                    {billingAddress.postcode},&nbsp;
                    {billingAddress.city},&nbsp;
                    {billingAddress.country}
                </p>
            </div>
        </div>
    );
};

export default Addresses;