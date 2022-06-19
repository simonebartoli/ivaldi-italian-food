import React from 'react';
import NameDob from "../components/account/name-dob";
import Email from "../components/account/email";
import Password from "../components/account/password";
import 'react-slidedown/lib/slidedown.css'
import LayoutPrivate from "../components/layout-private";

const Account = () => {
    return (
        <LayoutPrivate className="self-stretch flex h-full flex-col gap-8 items-center justify-start smxl:p-8 smx:p-4 px-0 py-4">
            <h1 className="text-3xl">My Account</h1>
            <NameDob/>
            <Email/>
            <Password/>
        </LayoutPrivate>
    );
};

export default Account;