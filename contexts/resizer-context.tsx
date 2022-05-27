import React, {createContext, ReactNode} from 'react';
import {useWindowHeight, useWindowWidth} from "@react-hook/window-size";
import {NextPage} from "next";

type ContextType = {
    widthPage: number
    heightPage: number
}

const resizerContext = createContext<undefined | ContextType>(undefined)

type Props = {
    children: ReactNode
}

export const ResizerContext: NextPage<Props> = ({children}) => {
    const widthPage = useWindowWidth();
    const heightPage = useWindowHeight()

    const value = {widthPage, heightPage}
    return (
        <resizerContext.Provider value={value}>
            {children}
        </resizerContext.Provider>
    );
};

export const useResizer = () => {
    const context = React.useContext(resizerContext)
    if (context === undefined) {
        throw new Error('useResizer must be used within a ResizerProvider')
    }
    return context
}
