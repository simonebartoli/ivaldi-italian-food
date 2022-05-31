import React from "react";

export const moveLabel = (ref: React.RefObject<HTMLDivElement>) => {
    if(ref.current !== null) {
        ref.current.style.top = "-1rem"
        ref.current.style.left = "0.25rem"
        ref.current.style.color = "black"
    }
}
export const revertLabel = (ref: React.RefObject<HTMLDivElement>) => {
    if(ref.current !== null) {
        ref.current!.style.top = "50%"
        ref.current!.style.left = "1rem"
        ref.current!.style.color = "rgb(115 115 115)"
    }
}