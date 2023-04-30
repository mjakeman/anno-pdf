import { useState } from "react";
import Modal from "../../Modal";
import UploadFileButton from "./UploadFileButton";

interface FileUploadModalProps {
    isVisible: boolean;
    onOutsideClick: (params: any) => any;
}

export default function FileUploadModal({isVisible, onOutsideClick}: FileUploadModalProps){

    const [isDragOver, setIsDragOver] = useState(false);

    const [uploadedFileName, setUploadedFileName] = useState<string>("No file selected");

    const borderStyle = isDragOver ? "border-2 border-dashed border-blue" : "border-2 border-dotted";

    return (
        <Modal isVisible={isVisible} onOutsideClick={onOutsideClick}>
            <div className="flex flex-col items-center w-[40vh] h-[40vh] p-4 dark:bg-anno-space-700 rounded-md gap-3">
                {/* <h1 className="text-2xl font-bold dark:text-white">Upload PDF</h1> */}
                <UploadFileButton onFileUpload={importFile}/>
                <div className={"w-full h-full flex flex-col items-center justify-center " + borderStyle} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={drop}>
                    <p className="text-center dark:text-white">Drag and drop your PDF here</p>
                    <p className="text-center dark:text-white">{uploadedFileName}</p>
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

    function importFile(file: File) {
        setUploadedFileName(file.name);
        console.log(file);
    }
}



