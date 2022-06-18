import React from 'react';
import {IoPersonCircleSharp} from "react-icons/io5";
import {BsFillCalendarWeekFill} from "react-icons/bs";

const NameDob = () => {
    return (
        <div className="flex flex-row justify-around items-center bg-neutral-50 rounded-lg p-8 w-full shadow-md">
            <div className="flex flex-row items-center justify-center gap-8">
                <IoPersonCircleSharp className="text-6xl"/>
                <div className="flex flex-col gap-2">
                    <span className="text-neutral-600">Full Name</span>
                    <span className="font-semibold text-2xl text-green-standard">Simone Bartoli</span>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
                <BsFillCalendarWeekFill className="text-5xl"/>
                <div className="flex flex-col gap-2">
                    <span className="text-neutral-600">Date of Birth</span>
                    <span className="font-semibold text-2xl text-green-standard">1st April 2001</span>
                </div>
            </div>
        </div>
    );
};

export default NameDob;