import React, {useContext, useRef, useState} from "react";
import Modal from "../../Modal";
import axios from "axios";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebaseAuth";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {DocumentArrowUpIcon} from "@heroicons/react/24/solid";
import PrimaryButton from "../../PrimaryButton";
import {useToast} from "../../../hooks/useToast";
import AnimatedSpinner from "../AnimatedSpinner";

interface Props {
    isVisible: boolean;
    onOutsideClick: (params: any) => any;
}

export default function FileUploadModal({isVisible, onOutsideClick}: Props){

    const {addToast} = useToast();

    const {firebaseUserRef} = useContext(AuthContext);

    const [isDragOver, setIsDragOver] = useState(false);

    const [uploadedFileName, setUploadedFileName] = useState<string>("No file selected");
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const input = useRef<HTMLInputElement>(null);

    const borderStyle = isDragOver ? "border-2 border-dashed border-blue-500" : "border-2 border-dotted";
    const bgStyle = isDragOver ? "bg-blue-100 dark:bg-anno-space-100" : "";

    let navigate = useNavigate();

    return (
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
            <div className="flex flex-col items-center w-[60vw] h-[60vh] p-6 dark:bg-anno-space-700 rounded-md gap-3">
                 <h1 className="text-2xl font-bold text-anno-red-primary dark:text-white self-start">Upload PDF</h1>
                 <h1 className="dark:text-zinc-300 self-start"><span className="text-anno-red-secondary">* </span>Please select a PDF file to upload</h1>
                <div className={`w-full h-full flex flex-col gap-2 items-center justify-center ${borderStyle} + ${bgStyle}`} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={drop}>
                    {isUploading ?
                        <AnimatedSpinner className={"mb-4 w-20 h-20 text-blue-500"}/>
                    :
                        <DocumentArrowUpIcon className="w-24 h-24 text-zinc-400 dark:text-white" />
                    }

                    <h1 className="text-2xl text-center dark:text-white">Drag & drop</h1>
                    <p className="text-2xl text-center dark:text-white">or <button onClick={()=>input.current?.click()} className="underline underline-offset-4 text-blue-500 hover:text-blue-800 transition-colors dark:text-anno-red-secondary dark:hover:text-anno-red-primary">browse</button></p>
                    <input type="file" id="file" name="file" onChange={handleFileUpload} accept="application/pdf" ref={input} className="hidden"/>
                    <p className="text-center text-zinc-400 dark:text-white">{uploadedFileName}</p>
                </div>
            </div>
        </Modal>
    )

    function dragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    }
    
    function dragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    }
    
    function drop(event: React.DragEvent<HTMLDivElement>) {
        dragLeave(event);
        const files = event.dataTransfer?.files;
        if (files && files[0] instanceof File) {
            importFile(files[0]);
        }
        
    }

    function handleFileUpload(event: any) {
        const file = event.target.files[0];
        importFile(file);
    }

    async function importFile(file: File) {
        setUploadedFileName(file.name);
        setIsUploading(true);
        let formData = new FormData();
        formData.append("file", file);
        let token = await firebaseUserRef!.getIdToken();
        axios.post(import.meta.env.VITE_BACKEND_URL + '/documents/create',formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            // Success
            addToast({
                message: 'Successfully created document!',
                type: 'success'
            })
            navigate(`/document/${response.data.uuid}`)
            setIsUploading(false);
        }).catch(error => {
            let message = "An error occurred. Please try again."
            if (error.response.data) {
                message = error.response.data;
            }
            addToast({
                message: message,
                type: 'error'
            })
            setUploadedFileName('No file selected');
            setIsUploading(false);
        });

    }
}




