import React, {ChangeEvent} from 'react';
import {BsSearch} from "react-icons/bs";
import {NextPage} from "next";

type Props = {
    query: string
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

const Search: NextPage<Props> = ({query, setQuery}) => {

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setQuery(newValue)
    }

    return (
        <div className="relative w-full flex flex-row justify-between items-center">
            <input
                value={query}
                onChange={(e) => handleQueryChange(e)}
                placeholder="Insert here the name of the product..."
                className="w-full p-3 rounded-lg shadow-md text-lg border-[1px] border-neutral-500"
                type="text"
            />
            <div className="cursor-pointer absolute top-1/2 right-0 px-4 -translate-y-1/2">
                <BsSearch className="text-3xl"/>
            </div>
        </div>
    );
};

export default Search;