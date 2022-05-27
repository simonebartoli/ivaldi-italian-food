import React, {useEffect, useRef} from 'react';
import styles from "../styles/loader.module.css"
import {NextPage} from "next";

type Props = {
    display: boolean
}

const Loader: NextPage<Props> = ({display}) => {
    const loaderRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if(!display && loaderRef.current !== null){
            loaderRef.current.style.opacity = "0"
            setTimeout(() => {
                if(loaderRef.current !== null) loaderRef.current.style.display = "none"
            }, 150)
        }
    }, [display])

    return (
        <div ref={loaderRef} className="transition-all bg-white z-50 fixed top-0 left-0 min-h-screen w-screen flex flex-row justify-center items-center">
            <div className={styles.halfCircleSpinner}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
            </div>
        </div>
    );
};

export default Loader;