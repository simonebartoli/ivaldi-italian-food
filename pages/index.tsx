import React from 'react';
import HomepageTop from "../components/index/temp/homepage-top";
import HomepageSlider from "../components/index/temp/homepage-slider";
import Contact from "../components/index/contact";

const Index = () => {
    return (
        <main className="w-full h-full">
            <HomepageTop/>
            <HomepageSlider/>
            <Contact/>
        </main>
    );
};

export default Index;