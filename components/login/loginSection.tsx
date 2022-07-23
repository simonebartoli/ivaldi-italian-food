import React from 'react';
import LoginWithPassword from "./loginWithPassword";
import LoginWithoutPassword from "./loginWithoutPassword";


const LoginSection = () => {

    return (
        //border-[1px] shadow-lg border-neutral-400 md:rounded-l-lg rounded-t-lg
        <article className="flex flex-col items-center justify-center basis-1/3 grow p-8 md:py-8 py-14 bg-neutral-100 self-stretch">
            <div className="flex flex-col gap-12 items-center">
                <h2 className="text-2xl">Login</h2>
                <div className="flex flex-col gap-10 w-full">
                    <LoginWithPassword/>
                    <span className="w-full pt-[1px] bg-neutral-400"/>
                    <p className="text-center">
                        You don&apos;t remember the Password? Insert your email below.
                    </p>
                    <LoginWithoutPassword/>
                </div>
            </div>
        </article>
    );
};

export default LoginSection;