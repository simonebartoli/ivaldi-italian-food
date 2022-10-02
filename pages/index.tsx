import React from 'react';
import HomepageTop from "../components/index/temp/homepage-top";
import HomepageSlider from "../components/index/temp/homepage-slider";
import Contact from "../components/index/contact";
import {HOST, TWITTER_USERNAME} from "../settings";
import Head from "next/head";

const Index = () => {
    return (
        <main className="w-full h-full">
            <Head>
                <title>{`Homepage - Ivaldi Italian Food`}</title>
                <meta name="description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
                <meta name="keywords" content={"food,italy,shop,low-cost,budget,meat,fish,cakes,cheese,mozzarella,parma,campana,dececco,rummo,nutella,barilla,mutti,mulino,bianco"}/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>

                <meta property="og:title" content={`Ivaldi Italian Food`}/>
                <meta property="og:site_name" content={HOST}/>
                <meta property="og:url" content={`${HOST}`}/>
                <meta property="og:description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
                <meta property="og:type" content="product"/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={TWITTER_USERNAME}/>
                <meta name="twitter:title" content={`${HOST}`}/>
                <meta name="twitter:description" content={"Do you like good, healthy food? If it is so, give it a try and we'll our best to deliver you the best authentic italian food. You'll not be deluded."}/>
            </Head>
            <HomepageTop/>
            <HomepageSlider/>
            <Contact/>
        </main>
    );
};

export default Index;