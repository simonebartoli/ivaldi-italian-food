import React from 'react';
import Head from "next/head";

const WorkInProgress = () => {
    return (
        <div>
            <Head>
                <title>Work in Progress - Ivaldi Italian Food</title>
            </Head>
            <div className="homepage-image w-screen h-screen overflow-hidden">
                <img
                    className="object-cover w-full h-full"  src="/media/photos/index/work-in-progress.webp" alt="work in progress image"/>
            </div>
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <div className="z-50 p-16 bg-black flex flex-col gap-20 text-white">
                    <span className="mdxl:text-8xl leading-[3rem] sm:text-6xl smxl:text-5xl text-4xl font-semibold text-center">Work in Progress</span>
                    <div className="flex flex-col gap-8">
                        <span className="text-center mdxl:text-4xl sm:text-3xl text-2xl leading-[3rem]">We are taking some improvement to make your experience better!</span>
                        <span className="text-center smxl:text-lg text-base italic">The site should be back soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkInProgress;