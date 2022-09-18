import React, {useEffect} from 'react';
import {useRouter} from "next/router";

const Terms = () => {
    const router = useRouter()
    useEffect(() => {
        router.push("/documents/Ivaldi Terms & Conditions.pdf")
        setTimeout(() => router.push("/shop"), 5000)
    }, [])
};

export default Terms;