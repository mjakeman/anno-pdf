import React, {useContext, useEffect, useRef, useState} from "react";
import {ToolContext} from "../../Editor";
import Eraser from "../model/tools/Eraser";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";

interface Props {
    id: string
}
export default function EraserTool({ id } : Props) {

    const [eraser, setEraser] = useState<Eraser>(new Eraser(id, 8));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));
    function handleEraserClick() {
        if (!isActiveTool)
            setActiveToolData(eraser);
    }

    function setEraserSize(newSize: number) {
        setEraser(new Eraser(eraser.id, newSize));
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);

    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isActiveTool ? 'border-2 bg-zinc-800' : 'bg-white dark:bg-transparent border-2 border-transparent'} p-1 `}>
               <button onClick={handleEraserClick} type="button" className={`bg-white ${isActiveTool ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  p-1 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
                    <svg className="w-7 h-7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.45963 9.11276L11.1484 4.73072C11.7536 4.16507 12.7029 4.19716 13.2685 4.80241L15.4168 7.10111C15.9825 7.70636 15.9504 8.65556 15.3451 9.22122L10.6564 13.6033L6.45963 9.11276Z" fill="#FF99A7" stroke="black"/>
                        <path d="M4.73091 12.7819C4.16526 12.1767 4.19735 11.2275 4.8026 10.6618L6.43194 9.13904L10.6287 13.6295L8.99935 15.1523C8.3941 15.7179 7.44489 15.6859 6.87924 15.0806L4.73091 12.7819Z" stroke="black"/>
                        <line x1="4.82715" y1="16.3271" x2="17.5126" y2="16.3271" stroke="black"/>
                    </svg>
                </button>
                {isActiveTool &&
                    <button onClick={() => setShowOptions(!showOptions)} type="button" className="text-white">
                        {showOptions ? <ChevronUpIcon className="w-6 h-6"/> : <ChevronDownIcon className="w-6 h-6"/>}
                    </button>
                }
            </span>


            {/* Options (color / stroke) */}
            {showOptions &&
                <div ref={dropdown} className="absolute mt-4 rounded-3xl border-2 border-stone-300 bg-zinc-800 flex flex-col gap-4 p-4 w-72">

                    {/* Stroke Size Range Slider + Preview */}
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <span className="text-white">Stroke</span>
                        <input onChange={(e) => setEraserSize(parseInt(e.target.value))} type="range" min="1" max="10" value={`${eraser.size}`} />
                        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r={eraser.size} fill="currentColor"/>
                        </svg>
                    </div>
                </div>
            }
        </span>


    )
}