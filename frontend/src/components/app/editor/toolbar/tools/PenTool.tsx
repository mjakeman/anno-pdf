import {PencilIcon} from "@heroicons/react/24/outline";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import React, {useContext, useEffect, useRef, useState} from "react";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import Pen from "../model/tools/Pen";
import {ToolContext} from "../../Editor";
import {useIsMount} from "../../../../../hooks/useIsMount";

interface Props {
    id: string
}
export default function PenTool({ id } : Props) {

    const isMount = useIsMount();
    const [pen, setPen] = useState<Pen>(new Pen(id, 2, '#000000'));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    function handleClick () {
       if (!isActiveTool)
           setActiveToolData(pen);
    }

    function handleColorSelect(selectedColor: string) {
        setPen((prevPen : Pen) => {
            const newPen = new Pen(prevPen.id, prevPen.size, prevPen.color);
            // Watch for error (when we assign a color which isn't allowed)
            try {
                newPen.color = selectedColor;
                return newPen;
            } catch (e) {
                console.log(e);
                return prevPen;
            }
        });
    }

    function setPenSize(newSize: number) {
        setPen(new Pen(pen.id, newSize, pen.color));
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);

    useEffect(() => {
        if (!isMount) setActiveToolData(pen);
    }, [pen]);

    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isActiveTool ? 'border-2 bg-zinc-800' : 'bg-white dark:bg-transparent border-2 border-transparent'} p-1 `}>

                <button onClick={handleClick} type="button" className={`bg-white ${isActiveTool ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  p-1 rounded-full transition-colors dark:hover:bg-anno-space-700`}>
                    <PencilIcon className="w-7 h-7 stroke-1" style={{fill: pen.color, stroke:  "black"}} />
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

                    {/* Color Palette */}
                    <div className="grid grid-cols-6 gap-2">
                        {pen.allowedColors.map((color: string, idx: number) => (
                            <div key={idx} onClick={() => handleColorSelect(color)} className={`${pen.color === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`} style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>

                    {/* Stroke Size Range Slider + Preview */}
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <span className="text-white">Stroke</span>
                        <input onChange={(e) => setPenSize(parseInt(e.target.value))} type="range" min={pen.minSize} max={pen.maxSize} value={pen.size} />
                        <svg className="w-14 w-14" viewBox={`0 0 ${pen.maxSize*2} ${pen.maxSize*2}`}>
                            <circle cx={pen.maxSize} cy={pen.maxSize} r={pen.size} fill={pen.color}/>
                        </svg>

                    </div>
                </div>
            }
        </span>
    )
}
