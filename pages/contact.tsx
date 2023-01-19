import React from 'react';
import {BsFacebook, BsInstagram, BsTelephonePlus} from "react-icons/bs";
import {HiOutlineMailOpen} from "react-icons/hi";
import Form from "../components/contact/form";
import Head from "next/head";
import {HOST, TWITTER_USERNAME} from "../settings";

const Contact = () => {
    return (
        <main className="flex flex-col items-center sm:p-8 px-4 py-8 pb-12 gap-8 w-full">
            <Head>
                <title>{`Contact - Ivaldi Italian Food`}</title>
                <meta name="description" content={"Any problem, concern, queries... in this page you'll find all the information you need to solve your problems."}/>
                <meta name="keywords" content={"queries,concerns,problems,questions,answer,contact,phone,email,address"}/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>

                <meta property="og:title" content={`Contact - Ivaldi Italian Food`}/>
                <meta property="og:site_name" content={HOST}/>
                <meta property="og:url" content={`${HOST}/contact`}/>
                <meta property="og:description" content={"Any problem, concern, queries... in this page you'll find all the information you need to solve your problems."}/>
                <meta property="og:type" content="product"/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={TWITTER_USERNAME}/>
                <meta name="twitter:title" content={`${HOST}/contact`}/>
                <meta name="twitter:description" content={"Any problem, concern, queries... in this page you'll find all the information you need to solve your problems."}/>
            </Head>
            <h1 className="text-4xl">Contact Us</h1>
            <section className="flex mdx:flex-row flex-col items-center justify-start w-full xls:gap-32 gap-20 p-3">
                <article className="flex flex-col gap-12 basis-1/3 grow items-center">
                    <p className="text-center smxl:text-xl text-lg leading-10">
                        You can contact &quot;Ivaldi Italian Food&quot; using phone, email or the contact form.
                        <span className="font-semibold"> Monday - Friday | 13:00 - 21:00</span>
                    </p>
                    <div className="flex flex-col gap-10 smxl:text-2xl smx:text-xl text-lg items-start">
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <HiOutlineMailOpen className="text-3xl"/>
                            <a href="mailto: info@ivaldi.uk" className="col-span-4 hover:text-green-standard hover-underline-animation">info@ivaldi.uk</a>
                        </div>
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <BsTelephonePlus className="text-3xl"/>
                            <a href="tel: +447743192857" className="col-span-4 hover:text-green-standard hover-underline-animation">+44 77 4319 2857</a>
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
                            <a rel={"noreferrer"} target={"_blank"} href="https://www.facebook.com/profile.php?id=100089324176503" className="col-span-4 hover:text-green-standard hover-underline-animation">Ivaldi Italian Food</a>
                        </div>
                        <div className="flex flex-row smxl:gap-12 gap-8">
                            <BsInstagram className="text-3xl"/>
                            <a rel={"noreferrer"} target={"_blank"} href="https://www.instagram.com/ivaldi_italian_food/?hl=it" className="col-span-4 hover:text-green-standard hover-underline-animation">Ivaldi Official Food</a>
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