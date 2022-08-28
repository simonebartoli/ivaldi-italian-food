import React from 'react';
import {IoPersonCircleSharp} from "react-icons/io5";
import {BsFillCalendarWeekFill} from "react-icons/bs";
import {NextPage} from "next";

type Props = {
    fullName: string | null
    dob: string | null
}

const NameDob: NextPage<Props> = ({fullName, dob}) => {
    return (
        <div className="flex mdx:flex-row flex-col gap-8 mdx:gap-0 justify-around items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="flex flex-row items-center justify-center gap-8 w-full">
                <IoPersonCircleSharp className="lg:text-6xl text-5xl mdx:w-auto w-1/2"/>
                <div className="flex flex-col gap-2 mdx:w-auto w-1/2">
                    <span className="text-neutral-600">Full Name</span>
                    <span className="font-semibold lg:text-2xl text-xl text-green-standard">
                        {fullName === null ? "Not Logged" : fullName}
                    </span>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-8 w-full">
                <BsFillCalendarWeekFill className="lg:text-5xl text-4xl mdx:w-auto w-1/2"/>
                <div className="flex flex-col gap-2 mdx:w-auto w-1/2">
                    <span className="text-neutral-600">Date of Birth</span>
                    <span className="font-semibold lg:text-2xl text-xl text-green-standard">
                        {dob === null ? "Not Logged" : dob}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NameDob;