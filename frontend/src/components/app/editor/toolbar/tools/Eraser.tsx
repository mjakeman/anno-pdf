import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../Editor";

interface Props {
    id: string
}
export default function Eraser({id} : Props) {

    const [selectedTool, setSelectedTool] = useContext(ToolContext);
    const [isSelected, setIsSelected] = useState(false);

    function handleEraserClick() {
        setSelectedTool(id);
    }

    useEffect(() => {
        setIsSelected(selectedTool === id);
    }, [selectedTool]);


    return (
        <button onClick={handleEraserClick} type="button" className={`${isSelected ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-200 p-2 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
            <svg className="w-7 h-7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.45963 9.11276L11.1484 4.73072C11.7536 4.16507 12.7029 4.19716 13.2685 4.80241L15.4168 7.10111C15.9825 7.70636 15.9504 8.65556 15.3451 9.22122L10.6564 13.6033L6.45963 9.11276Z" fill="#FF99A7" stroke="black"/>
                <path d="M4.73091 12.7819C4.16526 12.1767 4.19735 11.2275 4.8026 10.6618L6.43194 9.13904L10.6287 13.6295L8.99935 15.1523C8.3941 15.7179 7.44489 15.6859 6.87924 15.0806L4.73091 12.7819Z" stroke="black"/>
                <line x1="4.82715" y1="16.3271" x2="17.5126" y2="16.3271" stroke="black"/>
            </svg>
        </button>
    )
}