import React, {forwardRef, useEffect, useRef, useState} from 'react';
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
    moveBack: (oldRef: number, newRef: number) => void
    moveNext: (oldRef: number, newRef: number) => void
}

const BillingAddressList = forwardRef<HTMLDivElement, Props>(({moveBack, moveNext}, ref) => {
    const [addressIDSelected, setAddressIDSelected] = useState<number | null>(null)
    const [showAddAddressForm, setShowAddAddressForm] = useState(false)
    const [sameAsShipping, setSameAsShipping] = useState(false)
    const sameAsShippingRef = useRef<HTMLInputElement>(null)

    const array = new Array(2).fill(example)
    const exampleArray = array.map((element, index) => {
        return {
            ...element,
            address_id: index+1
        }
    })

    useEffect(() => {
        if(addressIDSelected !== null) {
            setSameAsShipping(false)
        }
    }, [addressIDSelected])

    const handleAddAddressClick = () => {
        setShowAddAddressForm(true)
    }
    const handleSameAsShippingInputClick = () => {
        setAddressIDSelected(null)
        setSameAsShipping(!sameAsShipping)
    }

    return (
        <section ref={ref} className="hidden flex flex-col items-center justify-center w-1/2 gap-8 py-8">
            <h2 className="text-3xl mb-8">Select your Billing Address</h2>
            <div className="flex flex-row gap-8">
                <input ref={sameAsShippingRef} onChange={handleSameAsShippingInputClick} checked={sameAsShipping} type="checkbox" className="scale-125"/>
                <span className="text-xl">Same as Shipping Address</span>
            </div>
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
            <div className="mt-8 flex flex-row w-full justify-between items-center gap-8">
                <button onClick={() => moveBack(1, 0)} className="hover:bg-red-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-red-600">Back</button>
                <button onClick={() => moveNext(1,2)} disabled={addressIDSelected === null && !sameAsShipping} className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-1/2 p-4 text-white text-center text-lg shadow-lg bg-green-standard">Next</button>
            </div>
        </section>
    );
});

BillingAddressList.displayName = "BillingAddressList"
export default BillingAddressList;