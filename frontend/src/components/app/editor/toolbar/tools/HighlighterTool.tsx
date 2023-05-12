import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import React, {useContext, useEffect, useRef, useState} from "react";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {ToolContext} from "../../Editor";
import Highlighter from "../model/tools/Highlighter";
import {useIsMount} from "../../../../../hooks/useIsMount";

interface Props {
    id: string
}
export default function HighlighterTool({ id } : Props) {

    const isMount = useIsMount();
    const [highlighter, setHighlighter] = useState<Highlighter>(new Highlighter(id, 12,'#dff000'));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    function handleClick () {
        if (!isActiveTool)
            setActiveToolData(highlighter);
    }

    function handleColorSelect(selectedColor: string) {
        setHighlighter((prevHighlighter : Highlighter) => {
            const newPen = new Highlighter(prevHighlighter.id, prevHighlighter.size, prevHighlighter.color);
            // Watch for error (when we assign a color which isn't allowed)
            try {
                newPen.color = selectedColor;
                return newPen;
            } catch (e) {
                console.log(e);
                return prevHighlighter;
            }
        });
    }

    function setPenSize(newSize: number) {
        setHighlighter(new Highlighter(highlighter.id, newSize, highlighter.color));
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);

    useEffect(() => {
        if (!isMount) setActiveToolData(highlighter);
    }, [highlighter]);


    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row gap-1 items-center rounded-full ${isActiveTool ? 'border-2 bg-zinc-800' : 'bg-white dark:bg-transparent border-2 border-transparent'} p-1'}`}>

                <button onClick={handleClick} type="button" className={`bg-white dark:bg-anno-space-700 ${isActiveTool ? 'border-2 ' : 'border-transparent border hover:bg-gray-200'}  rounded-full transition-colors dark:hover:bg-anno-space-700 p-1`}>
                    <svg className="w-7 h-7 stroke-0.5" style={{fill: highlighter.color, stroke:  "black"}} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.5" y="17.5" width="8" height="4"/>
                            <g clipPath="url(#clip0_100_553)">
                            <path d="M22.2984 4.70163C21.5295 3.93279 20.283 3.93279 19.5141 4.70163L18.6463 5.5695L21.4305 8.35373L22.2984 7.48587C23.0672 6.71702 23.0672 5.47048 22.2984 4.70163Z" fill="currentColor"/>
                            <path d="M20.635 9.14923L17.8508 6.365L8.73766 15.4781C8.27507 15.9407 7.93502 16.5113 7.74826 17.1383L7.14842 19.1519C7.08946 19.3499 7.14372 19.5642 7.28977 19.7102C7.43581 19.8563 7.65015 19.9106 7.8481 19.8516L9.86177 19.2517C10.4887 19.065 11.0593 18.7249 11.5219 18.2623L20.635 9.14923Z" fill="currentColor"/>
                            <path d="M22.2984 4.70163C21.5295 3.93279 20.283 3.93279 19.5141 4.70163L18.6463 5.5695L21.4305 8.35373L22.2984 7.48587C23.0672 6.71702 23.0672 5.47048 22.2984 4.70163Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.635 9.14923L17.8508 6.365L8.73766 15.4781C8.27507 15.9407 7.93502 16.5113 7.74826 17.1383L7.14842 19.1519C7.08946 19.3499 7.14372 19.5642 7.28977 19.7102C7.43581 19.8563 7.65015 19.9106 7.8481 19.8516L9.86177 19.2517C10.4887 19.065 11.0593 18.7249 11.5219 18.2623L20.635 9.14923Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_100_553">
                                <rect width="18" height="18" fill="red" transform="translate(6 3)"/>
                            </clipPath>
                        </defs>
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

                    {/* Color Palette */}
                    <div className="grid grid-cols-6 gap-2">
                        {highlighter.allowedColors.map((color: string, idx: number) => (
                            <div key={idx} onClick={() => handleColorSelect(color)} className={`${highlighter.color === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`} style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>

                    {/* Stroke Size Range Slider + Preview */}
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <span className="text-white">Stroke</span>
                        <input onChange={(e) => setPenSize(parseInt(e.target.value))} type="range" min={highlighter.minSize} max={highlighter.maxSize} value={`${highlighter.size}`} />
                        <svg className="w-16 w-16" viewBox={`0 0 ${highlighter.maxSize*2} ${highlighter.maxSize*2}`}>
                            <circle cx={highlighter.maxSize} cy={highlighter.maxSize} r={highlighter.size} fill={highlighter.color}/>
                        </svg>

                    </div>
                </div>
            }
        </span>
    )
}
