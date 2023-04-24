import { useRef } from "react";
import PrimaryButton from "../../PrimaryButton";

interface UploadFileButtonProps {
    onFileUpload: (file: File) => void;
}

export default function UploadFileButton({onFileUpload}: UploadFileButtonProps){
    const input = useRef<HTMLInputElement>(null);

    return(
        <>
            <PrimaryButton label="Select file to upload" onClick={()=>input.current?.click()}></PrimaryButton>
            <input type="file" id="file" name="file" onChange={handleFileUpload} accept="application/pdf" ref={input} className="hidden"/>
        </>
    )

function handleFileUpload(event: any) {
    const file = event.target.files[0];
    onFileUpload(file);
    console.log(file);
    // do something with file
}
}


