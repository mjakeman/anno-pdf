import React, {useContext, useEffect, useRef, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {PencilIcon} from "@heroicons/react/24/outline";
import {ToolContext} from "../../Editor";

interface Props {
    id: string
}
export default function Pen({id} : Props) {


    const [selectedTool, setSelectedTool] = useContext(ToolContext);
    const [isSelected, setIsSelected] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    function handlePenSelect() {
        setSelectedTool(id);
    }

    const colors = [
        '#0000FF',
        '#000000',
        '#FF0000',
        '#054107',
        '#90900c',
        '#FFFFFF',
    ]

    const [selectedColor, setSelectedColor] = useState(colors[0]); // TODO: change this to what you have recently selected
    function handleColorSelected(color: string) {
        setSelectedColor(color);
    }

    useEffect(() => {
        setIsSelected(selectedTool === id);
    }, [selectedTool]);

    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isSelected ? 'border-2 bg-zinc-800' : 'bg-white dark:bg-transparent border-2 border-transparent'} p-1 `}>

                <button onClick={handlePenSelect} type="button" className={`bg-white ${isSelected ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  p-1 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
                    <PencilIcon className="w-7 h-7 stroke-1" style={{fill: selectedColor, stroke:  "black"}} />
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
                            <div key={idx} onClick={() => handleColorSelected(color)} className={`${selectedColor === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`} style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-row gap-4 items-center justify-between">
                        <span className="text-white">Stroke</span>
                        <input onChange={(e) => setStrokeWidth(parseInt(e.target.value))} type="range" min="1" max="10" value={`${strokeWidth}`} />
                        <svg className="stroke-white" viewBox="0 0 23 13" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C9.5 0.5 13.5 1 12.5 7C11.7 11.8 20.8333 3.49996 22.5 0.5" strokeWidth={strokeWidth} />
                        </svg>

                    </div>
                </div>
            }
        </span>

    )
}