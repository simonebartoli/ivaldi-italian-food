import React, {useRef} from 'react';
import ArticleList from "../../components/shop/index/list/articleList";
import BestCategories from "../../components/shop/index/bestCategories";
import Filters from "../../components/library/filter/filters";
import HomeSectionList from "../../components/shop/index/list/homeSectionList";
import BestLogoList from "../../components/shop/index/list/bestLogoList";

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