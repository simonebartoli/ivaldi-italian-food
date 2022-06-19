import React from 'react';
import {BsFacebook, BsInstagram, BsTelephonePlus} from "react-icons/bs";
import {HiOutlineMailOpen} from "react-icons/hi";
import Form from "../components/contact/form";

const Contact = () => {
    return (
        <main className="flex flex-col items-center sm:p-8 px-4 py-8 pb-12 gap-8 w-full">
            <h1 className="text-4xl">Contact Us</h1>
            <section className="flex mdx:flex-row flex-col items-center justify-start w-full xls:gap-32 gap-20 p-3">
                <article className="flex flex-col gap-12 basis-1/3 grow items-center">
                    <p className="text-center smxl:text-xl text-lg leading-10">
                        You can contact &quot;Ivaldi Italian Food&quot; using phone, email or the contact form.
                        <span className="font-semibold"> Monday - Sunday | 8:00 - 18:00</span>
                    </p>
                    <div className="flex flex-col gap-10 smxl:text-2xl smx:text-xl text-lg items-start">
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <HiOutlineMailOpen className="text-3xl"/>
                            <a href="mailto: myemail@domain.com" className="col-span-4 hover:text-green-standard hover-underline-animation">myemail@domain.com</a>
                        </div>
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <BsTelephonePlus className="text-3xl"/>
                            <a href="tel: +447796513701" className="col-span-4 hover:text-green-standard hover-underline-animation">+44 77 9651 3701</a>
                        </div>
                    </div>
                    <span className="pt-[1px] bg-neutral-500 w-full"/>
                    <p className="text-center smxl:text-xl text-lg leading-10">
                        For any updates or to see reviews and feedback of other users follow us on
                        our social
                    </p>
                    <div className="flex flex-col gap-10 smxl:text-2xl smx:text-xl text-lg items-start">
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <BsFacebook className="text-3xl"/>
                            <a href="" className="col-span-4 hover:text-green-standard hover-underline-animation">Ivaldi Italian Food</a>
                        </div>
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <BsInstagram className="text-3xl"/>
                            <a href="" className="col-span-4 hover:text-green-standard hover-underline-animation">Ivaldi Official Food</a>
                        </div>
                    </div>
                </article>
                <article className="flex flex-col items-start basis-1/3 grow self-stretch smxl:p-3 p-0">
                    <Form/>
                </article>
            </section>
        </main>
    );
};

export default Contact;