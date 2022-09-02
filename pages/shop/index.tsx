import React, {useRef} from 'react';
import ArticleList from "../../components/shop/index/list/articleList";
import BestCategories from "../../components/shop/index/bestCategories";
import Filters from "../../components/library/filter/filters";
import HomeSectionList from "../../components/shop/index/list/homeSectionList";
import BestLogoList from "../../components/shop/index/list/bestLogoList";
import {HOST, TWITTER_USERNAME} from "../../settings";
import Head from "next/head";

const Index = () => {
    const mainRef = useRef<HTMLDivElement>(null)

    const highContrastSearchBar = (status: boolean) => {
        if(mainRef.current !== null){
            if(status) mainRef.current.classList.add("brightness-50")
            else mainRef.current.classList.remove("brightness-50")
        }
    }

    return (
        <main className="w-full flex flex-col items-center">
            <Head>
                <title>{`Shop - Ivaldi Italian Food`}</title>
                <meta name="description" content={"Are you searching good, quality, authentic FOOD? Here it is the place that satisfies all your requirements."}/>
                <meta name="keywords" content={"food,italy,shop,low-cost,budget,meat,fish,cakes,cheese,mozzarella,parma,campana,dececco,rummo,nutella,barilla,mutti,mulino,bianco"}/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="5 days"/>
                <meta name="author" content="Ivaldi Italian Food"/>

                <meta property="og:title" content={`Check out Italian Products on ${HOST}`}/>
                <meta property="og:site_name" content={HOST}/>
                <meta property="og:url" content={`${HOST}/shop`}/>
                <meta property="og:description" content={"If you're tired of the usual common food and you like Italy, you'll like this place too. Any type of italian products is here to solve all you necessities."}/>
                <meta property="og:type" content="product"/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={TWITTER_USERNAME}/>
                <meta name="twitter:title" content={`Check out Italian Products on ${HOST}`}/>
                <meta name="twitter:description" content={"If you're tired of the usual common food and you like Italy, you'll like this place too. Any type of italian products is here to solve all you necessities."}/>
            </Head>
            <Filters highContrastSearchBar={highContrastSearchBar}/>
            <div ref={mainRef} className="z-0 flex flex-col gap-12 transition-all bg-white w-full">
                <HomeSectionList/>
                <ArticleList/>
                <BestCategories/>
                <BestLogoList/>
            </div>
        </main>
    );
};

export default Index;