import React, {useContext, useEffect, useRef, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {ToolContext} from "../../Editor";

interface Props {
    id: string
}
export default function Rectangle({id} : Props) {

    const [selectedTool, setSelectedTool] = useContext(ToolContext);
    const [isSelected, setIsSelected] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    const colors = [
        '#0000FF',
        '#000000',
        '#FF0000',
        '#054107',
        '#90900c',
        '#FFFFFF',
    ]
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    function handleColorSelected(color: string) {
        setSelectedColor(color);
    }

    function handleRectangleClick() {
        setSelectedTool(id);
    }

    useEffect(() => {
        setIsSelected(selectedTool === id);
    }, [selectedTool]);



    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isSelected ? 'border-2 bg-zinc-800' : 'bg-white border-2 border-transparent'} p-1 `}>

                <button onClick={handleRectangleClick} type="button" className={`bg-white ${isSelected ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  p-1 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" fill="#FFEAED" stroke="#CA2D37"/>
                    </svg>
                </button>
                    {isSelected &&
                        <button onClick={() => setShowOptions(!showOptions)} type="button" className="text-white">
                        {showOptions ? <ChevronUpIcon className="w-6 h-6"/> : <ChevronDownIcon className="w-6 h-6"/>}
                        </button>
                    }
            </span>
            {showOptions &&
                <div ref={dropdown} className="absolute mt-4 rounded-3xl border-2 border-stone-300 bg-zinc-800 flex flex-col gap-4 p-4 w-72">

                    <div className="grid grid-cols-6 gap-2">
                        {colors.map((color, idx) => (
                            <div key={idx} onClick={() => handleColorSelected(color)} className={`${selectedColor === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`}  style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </span>

    )
}