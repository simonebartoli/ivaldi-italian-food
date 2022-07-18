import React, {useEffect, useRef, useState} from 'react';
import {NextPage} from "next";

type Props = {
    min: number
    max: number

    priceMin: number
    priceMax: number

    setPriceMin: React.Dispatch<React.SetStateAction<number>>
    setPriceMax: React.Dispatch<React.SetStateAction<number>>

    setFetchPriceRange: React.Dispatch<React.SetStateAction<boolean>>
}

const PriceSlider: NextPage<Props> = ({min, max, priceMin, priceMax, setPriceMin, setPriceMax, setFetchPriceRange}) => {
    const upperBoundRef = useRef<HTMLDivElement>(null)
    const lowerBoundRef = useRef<HTMLDivElement>(null)
    const separatorRef = useRef<HTMLDivElement>(null)
    const disabledUpperRef = useRef<HTMLDivElement>(null)
    const disabledLowerRef = useRef<HTMLDivElement>(null)
    const steps = 20

    const [priceRefMin, priceRefMax] = [min, max]

    const [minimum, setMinimum] = useState(0)
    const [maximum, setMaximum] = useState(steps-1)

    const [onEnterUpper, setOnEnterUpper] = useState(false)
    const [onEnterLower, setOnEnterLower] = useState(false)

    useEffect(() => {
        setPriceMin(min)
        setPriceMax(max)

        disabledUpperRef.current!.style.bottom = `0%`
        upperBoundRef.current!.style.top = `0%`

        separatorRef.current!.style.top = `100%`

        disabledLowerRef.current!.style.top = `0%`
        lowerBoundRef.current!.style.bottom = `0%`
    }, [min, max])

    const onMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
        const id = (e.target as Element).id
        if(id === "upper-bound"){
            setOnEnterUpper(true)
        }else{
            setOnEnterLower(true)
        }
    }
    const onMouseUp = (e: React.MouseEvent<HTMLSpanElement>) => {
        const id = (e.target as Element).id
        if(id === "upper-bound"){
            setOnEnterUpper(false)
        }else{
            setOnEnterLower(false)
        }
    }

    const onBreakPointEnter = (index: number) => {
        if(onEnterUpper){
            if(index < maximum){
                disabledUpperRef.current!.style.bottom = `${100 - (100/steps)*index}%`
                separatorRef.current!.style.top = `${(100/steps)*index}%`
                upperBoundRef.current!.style.top = `${(100/steps)*index}%`

                const newValue: number = +((priceRefMax - priceRefMin)/steps * index + priceRefMin).toFixed(2)
                setPriceMin(newValue)
                setMinimum(index+1)
                setFetchPriceRange(true)
            }
        }else if(onEnterLower){
            if(index > minimum){
                disabledLowerRef.current!.style.top = `${(100/steps)*index}%`
                separatorRef.current!.style.bottom = `${100 - (100/steps)*index}%`
                lowerBoundRef.current!.style.bottom = `${100 - (100/steps)*index}%`

                const newValue: number = +((priceRefMax - priceRefMin)/steps * index + priceRefMin).toFixed(2)
                setPriceMax(newValue)
                setMaximum(index-1)
                setFetchPriceRange(true)
            }
        }
    }

    return (
        <div className="mt-8 h-[300px] bg-white relative p-2 border-neutral-500 border-[1px] border-dashed rounded-full">
            <div ref={upperBoundRef} className="z-30 absolute top-0 left-0 rounded-full w-full">
                <span id="upper-bound" onMouseDown={(e) => onMouseDown(e)} onMouseUp={(e) => onMouseUp(e)} className="cursor-grab absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg bg-green-standard p-5 rounded-full"/>
                <span className="select-none font-semibold absolute left-[3rem] top-1/2 -translate-y-1/2 w-[12rem]">Lower Price: £{priceMin}</span>
            </div>
            <div ref={disabledUpperRef} className="absolute top-[0%] bg-neutral-300 p-2 left-1/2 -translate-x-1/2 rounded-full"/>
            <div ref={disabledLowerRef} className="absolute bottom-[0%] bg-neutral-300 p-2 left-1/2 -translate-x-1/2 rounded-full"/>

            <div ref={separatorRef} className="absolute top-[0%] bottom-[0%] bg-slate-300 p-2 left-1/2 -translate-x-1/2"/>
            {
                new Array(steps+1).fill([]).map((_, index) =>{
                    const top = `${100 / steps * index}%`
                    return(
                        <div key={index}
                             onMouseEnter={() => onBreakPointEnter(index)}
                             style={{top: top}}
                             className={`absolute w-full p-4 left-1/2 -translate-y-1/2 -translate-x-1/2`}/>
                    )
                })
            }
            <div ref={lowerBoundRef} className="z-30 absolute bottom-0 left-0 rounded-full w-full">
                <span id="lower-bound" onMouseDown={(e) => onMouseDown(e)} onMouseUp={(e) => onMouseUp(e)} className="cursor-grab shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg bg-green-standard p-5 rounded-full"/>
                <span className="select-none font-semibold absolute left-[3rem] top-1/2 -translate-y-1/2 w-[12rem]">Higher Price: £{priceMax}</span>
            </div>
        </div>
    );
};

export default PriceSlider;