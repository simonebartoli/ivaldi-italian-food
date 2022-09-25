import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {IoMdTrash} from "react-icons/io";
import Image from "next/image";
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";
const imageMimeType = /image\/(png|jpg|jpeg|webp)/i;

type Props = {
    product: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

const ImageUpload: NextPage<Props> = ({product}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null);
    const [fileDataURL, setFileDataURL] = useState<string | null>(null);

    const resetImage = () => {
        if(fileInputRef.current){
            fileInputRef.current!.value = ""
            setFile(null)
            setFileDataURL(null)
            product.set({
                ...product.value,
                image: null
            })
        }
    }
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        product.set({
            ...product.value,
            image: null
        })
        setFile(null)
        setFileDataURL(null)

        const MAX_SIZE = 2 * 1024 * 1024
        const file: File | undefined = e.target.files?.[0]
        if ((file && !file.type.match(imageMimeType)) || !file) {
            alert("Image mime type is not valid")
            return
        }
        if(file.size > MAX_SIZE){
            alert("The Image Size Can Be 2MB MAXIMUM")
            if(fileInputRef.current){
                fileInputRef.current!.value = ""
            }
            return
        }

        product.set({
            ...product.value,
            image: file
        })
        setFile(file ? file : null);
    }
    useEffect(() => {
        let fileReader: FileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target!;
                if (result && !isCancel) {
                    setFileDataURL(result as string)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);

    return (
        <div className="my-4 w-full flex flex-col gap-2">
            <div className="w-full flex flex-row gap-8 items-center justify-start">
                <span>Upload the New Image: </span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={"image/*"}
                    onChange={(e) => changeHandler(e)}
                />
                <IoMdTrash className="cursor-pointer text-2xl text-red-600 hover:text-red-500" onClick={resetImage}/>
            </div>
            {
                fileDataURL !== null &&
                <div className="relative h-[200px] w-full items-center justify-center flex">
                    <Image src={fileDataURL} layout={"fill"} objectFit={"contain"}/>
                </div>
            }
        </div>
    );
};

export default ImageUpload;