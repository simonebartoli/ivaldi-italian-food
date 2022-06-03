import React, {useRef} from 'react';
import SectionCategory from "../../components/shop/sectionCategory";
import BestCategories from "../../components/shop/bestCategories";
import Filters from "../../components/shop/filters";

const Index = () => {
    const mainRef = useRef<HTMLDivElement>(null)
    const highContrastSearchBar = () => {
        if(mainRef.current !== null){
            mainRef.current.classList.toggle("brightness-50")
        }
    }

    return (
        <main className="w-full flex flex-col items-center">
            <Filters highContrastSearchBar={highContrastSearchBar}/>
            <div ref={mainRef} className="z-0 flex flex-col gap-8 transition-all bg-white w-full py-8">
                <SectionCategory/>
                <BestCategories/>
            </div>
        </main>
    );
};

export default Index;