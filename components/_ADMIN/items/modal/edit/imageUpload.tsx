import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Image from "next/legacy/image";
import {IoMdTrash} from "react-icons/io";
import {CurrentProduct} from "../edit-form";
import {NextPage} from "next";
import {API_HOST} from "../../../../../settings";
const imageMimeType = /image\/(png|jpg|jpeg|webp|avif)/i;

type Props = {
    item: {
        photo_loc: string
    },
    currentProperty: {
        value: CurrentProduct
        set: React.Dispatch<React.SetStateAction<CurrentProduct>>
    }
}

const ImageUpload: NextPage<Props> = ({item, currentProperty}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null);
    const [fileDataURL, setFileDataURL] = useState<string | null>(null);

    const resetImage = () => {
        if(fileInputRef.current){
            fileInputRef.current!.value = ""
            setFile(null)
            setFileDataURL(null)
            currentProperty.set({
                ...currentProperty.value,
                image: null
            })
        }
    }
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        currentProperty.set({
            ...currentProperty.value,
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

        currentProperty.set({
            ...currentProperty.value,
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
        <div className="w-full flex flex-col gap-6 items-center">
            <span className="text-xl">Current Image: </span>
            <div className="relative h-[200px] w-full items-center justify-center flex">
                <Image src={API_HOST + item.photo_loc} layout={"fill"} objectFit={"contain"}/>
            </div>
            <hr className={"border-t-[1px] border-neutral-500 w-full"}/>
            <div className="flex flex-col gap-8 w-full">
                <div className="w-full flex flex-row gap-8 items-center justify-center">
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
        </div>
    );
};

export default ImageUpload;