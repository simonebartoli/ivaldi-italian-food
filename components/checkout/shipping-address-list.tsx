import React, {forwardRef, useState} from 'react';
import Address from "./address";
import AddAddress from "./add-address";

const example = {
    address_id: 1,
    first_address: "1 Yeo Street",
    second_address: "Caspian Wharf 40",
    postcode: "E33AE",
    city: "London",
    notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
}

type Props = {
    moveNext: (oldRef: number, newRef: number) => void
}

const ShippingAddressList = forwardRef<HTMLDivElement, Props>(({moveNext}, ref) => {
    const [addressIDSelected, setAddressIDSelected] = useState<number | null>(null)
    const [showAddAddressForm, setShowAddAddressForm] = useState(false)

    const array = new Array(2).fill(example)
    const exampleArray = array.map((element, index) => {
        return {
            ...element,
            address_id: index+1
        }
    })

    const handleAddAddressClick = () => {
        setShowAddAddressForm(true)
    }

    return (
        <section ref={ref} className="flex flex-col items-center justify-center w-1/2 gap-8 py-8">
            <h2 className="text-3xl mb-8">Select your Shipping Address</h2>
            {
                exampleArray.map((element, index) =>
                    <Address
                        key={index}
                        address={element}
                        addressSelected={{
                            addressIDSelected: addressIDSelected,
                            setAddressIDSelected: setAddressIDSelected
                        }}
                    />
                )
            }
            {
                showAddAddressForm ?
                    <AddAddress setShowAddAddressForm={setShowAddAddressForm}/>
                    :
                    <button onClick={handleAddAddressClick} className="rounded-lg w-full bg-green-500 transition hover:bg-green-standard p-4 shadow-lg text-center text-white text-lg">Add Address</button>
            }
            <button onClick={() => moveNext(0,1)} disabled={addressIDSelected === null} className="w-1/2 mt-4 rounded-lg disabled:cursor-not-allowed w-full disabled:bg-neutral-500 bg-green-standard hover:bg-green-500 transition p-4 shadow-lg text-center text-white text-lg">Next</button>
        </section>
    );
});

ShippingAddressList.displayName = "ShippingAddressList"
export default ShippingAddressList;