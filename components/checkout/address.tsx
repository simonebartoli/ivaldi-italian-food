import React from 'react';
import {TiTick} from "react-icons/ti";
import {NextPage} from "next";
import {AddressReactType} from "../../pages/checkout";


type Props = {
    address: AddressReactType
    addressSelected: null | AddressReactType,
    setAddressSelected: React.Dispatch<React.SetStateAction<AddressReactType | null>>
}

const Address: NextPage<Props> = ({address, addressSelected, setAddressSelected}) => {

    const handleAddressClick = () => {
        setAddressSelected(address)
    }

    return (
        <article onClick={handleAddressClick} className={`${addressSelected?.address_id === address.address_id ? "bg-green-600 text-neutral-100" : "bg-neutral-300 bg-opacity-75"} group transition shadow-md hover:bg-green-600 hover:text-neutral-100 cursor-pointer w-full p-6 rounded-lg flex flex-row gap-12 items-center justify-between`}>
            {
                addressSelected?.address_id === address.address_id ?
                    <div className={`${addressSelected?.address_id === address.address_id ? "border-white" : "border-black"} relative group-hover:border-white rounded-full border-[2px]`}>
                        <TiTick className="text-5xl"/>
                    </div>
                    :
                    <div className="relative group-hover:border-white rounded-full p-6 border-[2px] border-black"/>
            }
            <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="text-xl flex flex-row justify-between items-center w-full text-lg">
                    <div className="flex flex-row gap-2 items-center">
                        <span>{address.first_address},</span>
                        <span>{address.second_address}</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
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