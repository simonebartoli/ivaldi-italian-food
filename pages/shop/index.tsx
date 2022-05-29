import React from 'react';
import ArticleList from "../../components/shop/ArticleList";

const Index = () => {

    return (
        <main className="">
            <section className="grid grid-cols-4 p-8 gap-x-14 gap-y-12">
                {(new Array(5).fill([])).map((element, index) =>
                    <ArticleList key={index}/>
                )}

            </section>
        </main>
    );
};

export default Index;