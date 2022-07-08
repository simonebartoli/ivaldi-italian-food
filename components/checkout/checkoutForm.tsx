import React, {useState} from 'react';
import {
    PaymentElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        // const result = await stripe.confirmPayment({
        //     elements: elements,
        //     confirmParams: {
        //         return_url: "https://example.com"
        //     }
        // })
        const result = await stripe.confirmCardPayment(
            "pi_3LIIJjILFxyKM1ma1QVheD7I_secret_lPJjjTPZa7zp1R5EfxnpwTZSa",
            {
                payment_method: "pm_1LIIHjILFxyKM1mabohxTXQQ",
            }
        );
        console.log(result)
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            setError(result.error.message as string);
        } else {
            alert("NICE JOB")
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <section className="flex flex-col items-center justify-center gap-8 py-8 w-full">
            <h2 className="text-3xl mb-8">Your Payment Details</h2>
            <form onSubmit={(e) => handleSubmit(e)} className="w-full flex flex-col gap-12">
                <PaymentElement/>
                <button className="disabled:cursor-not-allowed disabled:bg-neutral-500 hover:bg-green-500 transition rounded-lg w-full p-4 text-white text-center text-lg shadow-lg bg-green-standard" disabled={elements === null}>Submit</button>
                {error !== null && <span className="text-lg text-red-600 text-center">{error}</span>}
            </form>
        </section>
    );
};

export default CheckoutForm;