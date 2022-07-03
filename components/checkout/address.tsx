import React from 'react';
import {TiTick} from "react-icons/ti";
import {NextPage} from "next";

type Props = {
    address: {
        address_id: number
        first_address: string
        second_address: string | null
        postcode: string
        city: string
        notes: string | null
    }
    addressSelected: {
        addressIDSelected: null | number,
        setAddressIDSelected: React.Dispatch<React.SetStateAction<number | null>>
    }
}

const Address: NextPage<Props> = ({address, addressSelected}) => {
    const handleAddressClick = () => {
        addressSelected.setAddressIDSelected(address.address_id)
    }

    return (
        <article onClick={handleAddressClick} className={`${addressSelected.addressIDSelected === address.address_id ? "bg-green-600 text-neutral-100" : "bg-neutral-300 bg-opacity-75"} group transition shadow-md hover:bg-green-600 hover:text-neutral-100 cursor-pointer w-full p-6 rounded-lg flex flex-row gap-12 items-center justify-between`}>
            {
                addressSelected.addressIDSelected === address.address_id ?
                    <div className={`${addressSelected.addressIDSelected === address.address_id ? "border-white" : "border-black"} relative group-hover:border-white rounded-full border-[2px]`}>
                        <TiTick className="text-5xl"/>
                    </div>
                    :
                    <div className="relative group-hover:border-white rounded-full p-6 border-[2px] border-black"/>
            }
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-xl flex flex-row justify-between items-center w-full text-lg">
                    <div className="flex flex-row gap-2">
                        <span>{address.first_address},</span>
                        <span>{address.second_address}</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <span>{address.postcode}, </span>
                        <span>{address.city}</span>
                    </div>
                </div>
                {
                    address.notes !== null && <span className="text-left w-full">{address.notes}</span>
                }
            </div>
        </article>
    );
};

export default Address;