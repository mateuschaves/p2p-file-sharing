import {useDropzone} from "react-dropzone";
import React, {useEffect, useState} from "react";
import {Image} from "react-bulma-components";
import "./ImageUploader.css";

export default function ImageUploader({setFile}) {
    const [filePreview, setFilePreview] = useState("");
    const {getRootProps, getInputProps} = useDropzone({
        multiple: false,
        accept: 'image/*',
        onDropAccepted: acceptedFiles => {
            setFile(acceptedFiles[0]);
            setFilePreview(URL.createObjectURL(acceptedFiles[0]))
        },
    });
    useEffect(() => () => {
        
        URL.revokeObjectURL(filePreview)
    }, [filePreview]);
    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Arraste e solte ou clique para selecionar uma foto</p>
            <div style={{height: "100%"}}>
                <Image
                    fallback="https://static.thenounproject.com/png/49665-200.png"
                    src={filePreview}

                />
            </div>
        </div>
    )
}