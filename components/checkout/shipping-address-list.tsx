import React, {forwardRef} from 'react';
import Address from "./address";
import AddAddress from "../addresses/add-address";
import {AddressReactType} from "../../pages/checkout";
import CSS from "csstype";

type Props = {
    moveNext: (oldRef: number, newRef: number) => void
    existingAddresses: AddressReactType[]
    setRenderFetchAddresses: React.Dispatch<React.SetStateAction<boolean>>

    selectedShippingAddress: AddressReactType | null
    setSelectedShippingAddress: React.Dispatch<React.SetStateAction<AddressReactType | null>>
}
type StyleType = {[any: string]: CSS.Properties}

const style: StyleType = {
    buttonStyle: {
        width: "100%"
    },
    buttonDivStyle: {
        padding: "0"
    },
    mainDiv: {
        width: "100%"
    },
    insertManualAddressButton: {
        width: "100%"
    },
    padding: {
        padding: "2em 0"
    }
}

const ShippingAddressList = forwardRef<HTMLDivElement, Props>(
    ({moveNext, existingAddresses, setRenderFetchAddresses, selectedShippingAddress, setSelectedShippingAddress},
     ref) => {

    return (
        <section ref={ref} className="flex flex-col items-center justify-center xls:w-1/2 mdx:w-2/3 md:w-3/4 w-full gap-12 px-4 py-8">
            <h2 className="text-3xl mb-8 text-center">Select your Shipping Address</h2>
            <span className="text-lg font-semibold leading-8 text-gray-700 p-4 rounded-lg bg-cyan-100 w-full text-center shadow-lg border-2 border-cyan-400">
                We currently deliver only in LONDON<br/>
                <span className={"text-sm font-normal leading-6"}>Any order with a delivery address outside LONDON might be rejected with a partial refund</span>
            </span>
            {
                existingAddresses.length === 0 ?
                    <div className="w-full flex items-center p-10 bg-neutral-100 rounded-lg">
                        <span className="w-full text-center text-4xl text-neutral-500">No Address Saved for Now</span>
                    </div>                :
                existingAddresses.map((element) =>
                    <Address
                        key={element.address_id}
                        address={element}
                        addressSelected={selectedShippingAddress}
                        setAddressSelected={setSelectedShippingAddress}
                    />
                )
            }

            <AddAddress
                billing={false}
                setRenderFetchAddresses={setRenderFetchAddresses}
                style={style}
            />
            <button onClick={() => moveNext(0,1)} disabled={selectedShippingAddress === null} className="w-full smxl:w-1/2 mt-4 rounded-lg disabled:cursor-not-allowed w-full disabled:bg-neutral-500 bg-green-standard hover:bg-green-500 transition p-4 shadow-lg text-center text-white text-lg">Next</button>
        </section>
    );
});

ShippingAddressList.displayName = "ShippingAddressList"
export default React.memo(ShippingAddressList);