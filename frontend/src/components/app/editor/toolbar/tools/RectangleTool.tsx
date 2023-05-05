import React, {useContext, useEffect, useRef, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {ToolContext} from "../../Editor";
import Highlighter from "../model/tools/Highlighter";
import Rectangle from "../model/tools/Rectangle";
import Pen from "../model/tools/Pen";

interface Props {
    id: string
}
export default function RectangleTool({id} : Props) {
    const [rectTool, setRectTool] = useState<Rectangle>(new Rectangle(id, '#000000'));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    function handleFillColorSelect(selectedColor: string) {
        setRectTool((prevRectTool : Rectangle) => {
            const newRect = new Rectangle(prevRectTool.id, prevRectTool.color);
            // Watch for error (when we assign a color which isn't allowed)
            try {
                newRect.color = selectedColor;
                return newRect;
            } catch (e) {
                console.log(e);
                return prevRectTool;
            }
        });
    }

    function handleRectangleClick() {
        setActiveToolData(rectTool);
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);

    useEffect(() => {
        setActiveToolData(rectTool);
    }, [rectTool]);


    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isActiveTool ? 'border-2 bg-zinc-800' : 'bg-white border-2 border-transparent'} p-1 `}>

                <button onClick={handleRectangleClick} type="button" className={`bg-white ${isActiveTool ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  p-1 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" fill="#FFEAED" stroke="#CA2D37"/>
                    </svg>
                </button>
                {isActiveTool &&
                    <button onClick={() => setShowOptions(!showOptions)} type="button" className="text-white">
                        {showOptions ? <ChevronUpIcon className="w-6 h-6"/> : <ChevronDownIcon className="w-6 h-6"/>}
                    </button>
                }
            </span>
            {showOptions &&
                <div ref={dropdown} className="absolute mt-4 rounded-3xl border-2 border-stone-300 bg-zinc-800 flex flex-col gap-4 p-4 w-72">

                    <div className="grid grid-cols-6 gap-2">
                        {rectTool.allowedColors.map((color: string, idx: number) => (
                            <div key={idx} onClick={() => handleFillColorSelect(color)} className={`${rectTool.color === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`}  style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </span>

    )
}