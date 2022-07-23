import React from 'react';
import Image from "next/image";
import SignupPhoto from "../../public/media/photos/login/signup.jpg"
import {BiSubdirectoryRight} from "react-icons/bi";
import Link from "next/link";
import {NextPage} from "next";

type Props = {
    redirectTo: string | null
}

const SignupSection: NextPage<Props> = ({redirectTo}) => {
    return (
        //border-4 border-black
        // md:rounded-r-lg rounded-b-lg
        <article className="relative flex flex-col md:gap-0 gap-14 justify-around items-center self-stretch p-8 basis-1/3 grow shadow-lg">
            <div className="homepage-image -z-10">
                <Image src={SignupPhoto} layout="fill" objectFit="cover" alt="Italian Food" placeholder="blur"/>
            </div>
            <h2 className="p-4 border-white bg-[rgb(0,0,0,0.8)] text-2xl text-white font-semibold text-center">Never Registered Before?</h2>
            <div className="flex flex-col gap-4 text-white p-4 bg-[rgb(0,0,0,0.8)] border-white ">
                <span className="text-xl pb-4">Register to be able to: </span>
                <div className="flex flex-row gap-4 items-center">
                    <BiSubdirectoryRight/>
                    <span>Manage your Orders</span>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <BiSubdirectoryRight/>
                    <span>Track your Shipping</span>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <BiSubdirectoryRight/>
                    <span>Finalize your Payments</span>
                </div>
                <div className="flex flex-row gap-4 items-center">
                    <BiSubdirectoryRight/>
                    <span>Review your Invoices</span>
                </div>
            </div>
            <div className="button-animated hover:before:w-full before:bg-[#008c2e] z-0 smxl:w-1/2 w-2/3 bg-green-standard border-black border-2 rounded-lg">
                <Link href={redirectTo !== null ? `/signup?${redirectTo}` : "/signup"}>
                    <a className="relative block z-10 p-4 text-center text-white shadow-lg text-lg">Signup Now</a>
                </Link>
            </div>
        </article>
    );
};

export default SignupSection;